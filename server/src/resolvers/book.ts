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

@Resolver()
export class BookResolver {
  @Mutation(() => BookResponse)
  @UseMiddleware(isAuth)
  async publishBook(
    @Arg('input') input: BookInput,
    @Ctx() { req }: MyContext
  ): Promise<BookResponse> {
    // insert & select
    const book = await Book.create({
      ...input,
      ownerId: req.session.userId,
    }).save();

    return { book };
  }

  @Query(() => [Book])
  async books(@Arg('id', () => Int) id: number) {
    const books = await Book.find({ where: { ownerId: id } });
    return books;
  }
}
