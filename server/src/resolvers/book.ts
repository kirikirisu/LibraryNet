import { Query, Resolver } from "type-graphql";

@Resolver()
export class BookResolver {
  @Query(() => String)
  helloBook() {
    return "hello world";
  }
}
