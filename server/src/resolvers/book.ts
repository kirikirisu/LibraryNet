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

@Resolver()
export class BookResolver {
  @Mutation(() => Book)
  @UseMiddleware(isAuth)
  publishBook(
    @Arg('input') input: BookInput,
    @Ctx() { req }: MyContext
  ): Promise<Book> {
    // insert & select
    return Book.create({
      ...input,
      ownerId: req.session.userId,
    }).save();
  }

  @Query(() => [Book])
  async books(@Arg('id', () => Int) id: number) {
    const books = await Book.find({ where: { ownerId: id } });
    return books;
  }
}
