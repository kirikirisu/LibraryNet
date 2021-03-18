import { Book } from '../entities/Book';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Library } from '../entities/Library';
import { SharedBook } from '../entities/SharedBook';
import {getConnection} from "typeorm";
import { User } from '../entities/User';
import { sendMessageToChannel } from '../utils/sendMessageToChannel';


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
  available: "valid" | "asking" | "invalid";
}

@ObjectType()
class BookResponse {
  @Field(() => String, { nullable: true })
  errors?: String;

  @Field(() => Book, { nullable: true })
  book?: Book;
}

@ObjectType()
class SubscribeResponse {
  @Field(() => String, { nullable: true })
  errors?: String;

  @Field(() => Boolean, { nullable: true })
  shared?: Boolean
}

@Resolver()
export class BookResolver {
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
    @Arg('id') id: number,
    @Ctx() { req }: MyContext
  ): Promise<SubscribeResponse> {
    const {userId} = req.session
    // 本を借りる人
    const subscriber = await User.findOne({ where: {id: userId}})
    const book = await Book.findOne({ where: { id }})
    const library = await Library.findOne({ where: { adminId: book?.ownerId }})
    // 借りる本が組織からなのか個人からなのか
    // libraryからorganizationを参照するより、userから参照したい
    // const publisher = User.findOne({ where: { id: book.ownerId } })
    // publisher.organization

    // 借りる人が組織なのか個人なのか(組織は本を借りることができない)
    // TODO:userからorganizationフラグを参照したい

    if (userId === book?.ownerId) {
      return { errors: "can not subscribe own book" }
    }

    if (!book) {}
    if (!subscriber) {
      return { errors: "can not find user"}
    }

    if (!book?.available) {
      return { errors: "already subscribed other" }
    }

    console.log("-------------------------done sub---------------------------")
    if (true) {
      // change book state
      await getConnection()
          .createQueryBuilder()
          .update(Book)
          .set({
            available: "invalid"
          })
          .where("id = :id", {id: id})
          .execute()


      let shared = await SharedBook.create({
        publisherId: book?.ownerId,
        subscriberId: userId,
        bookId: id,
      }).save()

      const status = await sendMessageToChannel({ user: subscriber, book})

      console.log("status", status)
      const sucsess = status === 200

      return { shared: sucsess}

    }
      return {shared: true}
  }

  // @Mutation(() => Number, {nullable: true})
  // async testPostMessageToSlack(): Promise<number> {

  //  console.log("status",status)
  //  return status
  // }

  @Query(() => [Book])
  async books(@Arg('id', () => Int) id: number) {
    const books = await Book.find({ where: { ownerId: id } });
    return books;
  }

  @Query(() => Book, {nullable: true})
  async book(@Arg('id', () => Int) id: number) {
    const book = await Book.findOne({ where: { id: id } });
    return book;
  }
}
