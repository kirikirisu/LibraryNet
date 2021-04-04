import { Book } from '../entities/Book';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { Library } from '../entities/Library';
import { SharedBook } from '../entities/SharedBook';
import { getConnection } from 'typeorm';
import { User } from '../entities/User';
import { sendMessageToChannel } from '../utils/sendMessageToChannel';
import { sendDirectMessage } from '../utils/sendDirectMessage';
import { createMessage } from '../utils/createMessage';

@InputType()
class BookInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  img: string;

  @Field()
  inforLink: string;

  @Field()
  available: 'valid' | 'asking' | 'invalid';
}

@ObjectType()
class BookResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => Book, { nullable: true })
  book?: Book;
}

@ObjectType()
class SubscribeResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => Boolean, { nullable: true })
  shared?: boolean;
}

@Resolver(Book)
export class BookResolver {
  @FieldResolver(() => Int, { nullable: true })
  async subscriberId(
    @Root() book: Book,
    @Ctx() { sharedLoader }: MyContext
  ): Promise<number> {
    // const sharedBook = await SharedBook.findOne({where: { bookId: book.id }})

    return sharedLoader.load(book.id);
    // const subscriber = await User.findOne({ where: { id: sharedBook?.subscriberId } })

    // if (subscriber) {
    //   return subscriber
    // }

    // return null;
  }

  @Mutation(() => BookResponse)
  @UseMiddleware(isAuth)
  async publishBook(
    @Arg('input') input: BookInput,
    @Ctx() { req }: MyContext
  ): Promise<BookResponse> {
    const { userId } = req.session;
    const library = await Library.findOne({ where: { adminId: userId } });

    // if user not have library
    if (!library) {
      return { errors: 'please create your library' };
    }

    // insert & select
    const book = await Book.create({
      ...input,
      ownerId: userId,
    }).save();

    return { book };
  }

  @Mutation(() => SubscribeResponse)
  @UseMiddleware(isAuth)
  async subscribeBook(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<SubscribeResponse> {
    const { userId } = req.session;

    const subscriber = await User.findOne({ where: { id: userId } });
    const book = await Book.findOne({ where: { id } });
    const publisher = await User.findOne({ where: { id: book?.ownerId } });

    // const library = await Library.findOne({ where: { adminId: book?.ownerId }})
    // 借りる本が組織からなのか個人からなのか
    // libraryからorganizationを参照するより、userから参照したい
    // publisher.organization

    // 借りる人が組織なのか個人なのか(組織は本を借りることができない)
    // TODO:userからorganizationフラグを参照したい

    if (userId === book?.ownerId) {
      return { errors: 'can not subscribe own book' };
    }

    if (!book) {
      return { errors: 'can not find user' };
    }
    if (!subscriber) {
      return { errors: 'can not find subscriber' };
    }
    if (!publisher) {
      return { errors: 'can not find publisher' };
    }

    if (book?.available === 'invalid') {
      return { errors: 'already subscribed other' };
    }

    if (book?.available === 'asking') {
      return { errors: 'this book asking' };
    }

    // 組織が本を借りることはない
    if (subscriber.organization) {
      return { errors: 'organization can not subscribe' };
    }

    console.log(
      '-------------------------start subscription---------------------------'
    );
    let shared;
    // 組織から本を借りる場合
    if (publisher.organization) {
      // change book state
      await getConnection()
        .createQueryBuilder()
        .update(Book)
        .set({
          available: 'invalid',
        })
        .where('id = :id', { id: id })
        .execute();

      // insert & select
      await SharedBook.create({
        publisherId: book?.ownerId,
        subscriberId: userId,
        bookId: id,
      }).save();

      const { blocks } = createMessage(subscriber, book, false);
      // console.log('channelId', publisher.slackId);
      const status = await sendMessageToChannel(publisher.slackId, blocks);

      console.log('status', status);
      shared = status === 200;

      // 個人から本を借りる場合
    } else {
      // change book state
      await getConnection()
        .createQueryBuilder()
        .update(Book)
        .set({
          available: 'asking',
        })
        .where('id = :id', { id: id })
        .execute();

      const status = await sendDirectMessage(publisher, subscriber, book);
      console.log('Did send DM?', status);
    }

    return { shared };
  }

  @Mutation(() => Boolean)
  async returnBook(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const { userId } = req.session;

    const shared = await SharedBook.findOne({
      where: { bookId: id, subscriberId: userId },
    });

    if (!shared) {
      return false;
    }

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(SharedBook)
      .where('bookId = :id', { id })
      .execute();

    await getConnection()
      .createQueryBuilder()
      .update(Book)
      .set({
        available: 'valid',
      })
      .where('id = :id', { id })
      .execute();

    return true;
  }

  // @Mutation(() => Number, {nullable: true})
  // async testPostMessageToSlack(): Promise<number> {

  //  console.log("status",status)
  //  return status
  // }

  // 貸し出し可能な本のみ返す
  @Query(() => [Book], { nullable: true })
  async books(@Arg('id', () => Int) id: number): Promise<Book[]> {
    // const books = await Book.find({ where: { ownerId: id } });
    // return books;

    // クエリビルダーでselectを行うと返り値がエイリアスによりBook型でなくってしまう
    const books = await getConnection().query(
      `
       select *
       from book
       where book."ownerId" = ${id}
       and book.available = 'valid'
      `
    );

    return books;
  }

  @Query(() => [Book], { nullable: true })
  async mySubscribeBooks(@Ctx() { req }: MyContext): Promise<Book[]> {
    const { userId } = req.session;
    // const mySubs = await getConnection().query(
    //   `
    //   select shared_book."bookId"
    //   from shared_book
    //   where shared_book."subscriberId" = ${userId}
    //  `
    // );

    const mySubs = await SharedBook.find({ where: { subscriberId: userId } });
    const mySubsBookIds = mySubs.map((sub) => sub.bookId);

    const mySubBooks = await Book.findByIds(mySubsBookIds);

    console.log(mySubBooks);
    return mySubBooks;
  }

  @Query(() => [Book], { nullable: true })
  async myPublishBooks() {}

  @Query(() => Book, { nullable: true })
  async book(@Arg('id', () => Int) id: number) {
    const book = await Book.findOne({ where: { id: id } });
    return book;
  }
}
