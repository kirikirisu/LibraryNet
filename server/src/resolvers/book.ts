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
  available: boolean;
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
    const user = await User.findOne({ where: {id: userId}})
    const book = await Book.findOne({ where: { id }})
    // const library = await Library.findOne({ where: { adminId: userId }})

    if (userId === book?.ownerId) {
      return { errors: "can not subscribe own book" }
    }

    if (!book) {}
    if (!user) {
      return { errors: "can not find user"}
    }

    if (!book?.available) {
      return { errors: "already subscribed" }
    }

    console.log("-------------------------done sub---------------------------")
    await getConnection()
        .createQueryBuilder()
        .update(Book)
        .set({
          available: false
        })
        .where("id = :id", {id: id})
        .execute()

    let shared = await SharedBook.create({
      publisherId: book?.ownerId,
      subscriberId: userId,
      bookId: id,
    }).save()

    const status = await sendMessageToChannel({ user, book})

    console.log("status", status)

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
