import { Book } from "../entities/Book";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

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
  libraryId: number;
}

@Resolver()
export class BookResolver {
  @Mutation(() => Book)
  @UseMiddleware(isAuth)
  publishBook(
    @Arg("input") input: BookInput,
    @Ctx() { req }: MyContext
  ): Promise<Book> {
    // insert & select
    return Book.create({
      ...input,
    }).save();
  }

  @Query(() => String)
  helloBook() {
    return "this is book resolver";
  }
}
