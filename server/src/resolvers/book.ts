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
    const book = await Book.findOne({ where: { id }})
    const library = await Library.findOne({ where: { adminId: userId }})

    if (userId === book?.ownerId) {
      return { errors: "can not subscribe own book" }
    }

    if (!book?.available) {
      return { errors: "already subscribed"}
    }

    let shared;
    if (library?.organization){
      await getConnection()
          .createQueryBuilder()
          .update(Book)
          .set({
            available: false
          })
          .where("id = :id", {id: id})

      shared = await SharedBook.create({
        publisherId: book?.ownerId,
        subscriberId: userId,
        bookId: id,
      }).save()

    }

    console.log(shared)

    return {shared: true}
  }

  @Query(() => [Book])
  async books(@Arg('id', () => Int) id: number) {
    const books = await Book.find({ where: { ownerId: id } });
    return books;
  }
}
