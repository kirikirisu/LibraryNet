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
import { createChannelMessage } from '../utils/createChannelMessage';
import { createDirectMessage } from '../utils/createDirectMessage';

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
class SubscribeBookFromOrganizationResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => Book, { nullable: true })
  sharedBook?: Book;
}

@ObjectType()
class SubscribeBookFromIndividualResponse {
  @Field(() => String, { nullable: true })
  errors?: string;

  @Field(() => Boolean, { nullable: true })
  sendDM?: boolean;
}

@Resolver(Book)
export class BookResolver {
  @FieldResolver(() => User, { nullable: true })
  async subscriber(
    @Root() book: Book,
    @Ctx() { subscriberLoader }: MyContext
  ): Promise<number> {
    return subscriberLoader.load(book.id);
  }

  @FieldResolver(() => User, { nullable: true })
  async owner(
    @Root() book: Book,
    @Ctx() { userLoader }: MyContext
  ): Promise<number> {
    return userLoader.load(book.ownerId);
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

  @Mutation(() => SubscribeBookFromOrganizationResponse)
  @UseMiddleware(isAuth)
  async subscribeBookFromOrganization(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<SubscribeBookFromOrganizationResponse> {
    const { userId } = req.session;

    const subscriber = await User.findOne({ where: { id: userId } });
    const book = await Book.findOne({ where: { id } });
    const publisher = await User.findOne({ where: { id: book?.ownerId } });

    if (!book) {
      return { errors: 'can not find book' };
    }
    if (!subscriber) {
      return { errors: 'can not find subscriber' };
    }
    if (!publisher) {
      return { errors: 'can not find publisher' };
    }
    // 組織が本を借りることはない
    if (subscriber.organization) {
      return { errors: 'organization can not subscribe' };
    }

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

    const { blocks } = createChannelMessage(subscriber, book, false);
    // console.log('channelId', publisher.slackId);
    const { status } = await sendMessageToChannel(publisher.slackId, blocks);

    if (status !== 200) {
      return { errors: 'con not send message to slack channel' };
    }
    return { sharedBook: book };
  }

  @Mutation(() => SubscribeBookFromIndividualResponse)
  @UseMiddleware(isAuth)
  async subscribeBookFromIndividual(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<SubscribeBookFromIndividualResponse> {
    const { userId } = req.session;

    const subscriber = await User.findOne({ where: { id: userId } });
    const book = await Book.findOne({ where: { id } });
    const publisher = await User.findOne({ where: { id: book?.ownerId } });

    if (!book) {
      return { errors: 'can not find book' };
    }
    if (!subscriber) {
      return { errors: 'can not find subscriber' };
    }
    if (!publisher) {
      return { errors: 'can not find publisher' };
    }
    // 組織が本を借りることはない
    if (subscriber.organization) {
      return { errors: 'organization can not subscribe' };
    }

    await getConnection()
      .createQueryBuilder()
      .update(Book)
      .set({
        available: 'asking',
      })
      .where('id = :id', { id: id })
      .execute();

    const { blocks } = createDirectMessage(subscriber, publisher, book, false);

    const { status } = await sendDirectMessage(publisher, subscriber, blocks);

    if (status !== 200) {
      return { errors: 'can not send direct message to slack' };
    }
    // sendDM or askingBookId
    return { sendDM: true };
  }

  @Mutation(() => Boolean)
  async returnBook(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const { userId } = req.session;

    const subscriber = await User.findOne({ where: { id: userId } });
    const book = await Book.findOne({ where: { id } });
    const publisher = await User.findOne({ where: { id: book?.ownerId } });

    if (!subscriber || !book || !publisher) {
      throw new Error('not found any');
    }

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

    if (publisher.organization) {
      const { blocks } = createChannelMessage(subscriber, book, true);

      const status = await sendMessageToChannel(publisher.slackId, blocks);
      console.log('Did send to chan?', status);
    } else {
      const { blocks } = createDirectMessage(subscriber, publisher, book, true);

      const status = await sendDirectMessage(publisher, subscriber, blocks);
      console.log('Did send DM?', status);
    }

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

    const mySubs = await SharedBook.find({ where: { subscriberId: userId } });
    const mySubsBookIds = mySubs.map((sub) => sub.bookId);

    const mySubBooks = await Book.findByIds(mySubsBookIds);

    return mySubBooks;
  }

  @Query(() => [Book], { nullable: true })
  async myPublishBooks(@Ctx() { req }: MyContext): Promise<Book[]> {
    const { userId } = req.session;

    const myPubBooks = Book.find({ where: { ownerId: userId } });

    return myPubBooks;
  }

  // @Query(() => Book, { nullable: true })
  // async book(@Arg('id', () => Int) id: number) {
  //   const book = await Book.findOne({ where: { id: id } });
  //   return book;
  // }
}
