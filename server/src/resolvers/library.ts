import { isAuth } from '../middleware/isAuth';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { MyContext } from 'src/types';
import { Library } from '../entities/Library';

@InputType()
class LibraryInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  icon: string;

  @Field()
  organization: boolean;
}

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Resolver()
export class LibraryResolver {
  @Mutation(() => Library)
  @UseMiddleware(isAuth)
  async createLibrary(
    @Arg('input') input: LibraryInput,
    @Ctx() { req }: MyContext
  ): Promise<Library> {
    return Library.create({
      ...input,
      adminId: req.session.userId,
    }).save();
  }

  // @Mutation(() => Library)
  // updateLibrary(){}

  @Query(() => [Library], { nullable: true })
  async librarys() {
    const librarys = await Library.find({});
    console.log(librarys);

    return librarys;
  }
}
