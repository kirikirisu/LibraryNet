import { isAuth } from "../middleware/isAuth";
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
import { MyContext } from "src/types";
import { Library } from "../entities/Library";

@InputType()
class LibraryInput {
  @Field()
  description: string;

  @Field()
  icon: string;

  @Field()
  organization: boolean;
}

@Resolver()
export class LibraryResolver {
  @Mutation(() => Library)
  @UseMiddleware(isAuth)
  async createLibrary(
    @Arg("input") input: LibraryInput,
    @Ctx() { req }: MyContext
  ): Promise<Library> {
    return Library.create({
      ...input,
      ownerId: req.session.userId,
    }).save();
  }

  // @Mutation(() => Library)
  // updateLibrary(){}

  @Query(() => [Library], { nullable: true })
  async librarys() {
    const librarys = await Library.find({});
    console.log(librarys);
    if (!librarys) {
      return null;
    }

    return librarys;
  }
}
