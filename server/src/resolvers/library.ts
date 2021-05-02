import { isAuth } from '../middleware/isAuth';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { FieldError, LibraryInput, MyContext } from '../types';
import { Library } from '../entities/Library';
import { validateLibrary } from '../utils/validateLibrary';
import { User } from '../entities/User';

@ObjectType()
class LibraryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Library, { nullable: true })
  library?: Library;
}
// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Resolver(Library)
export class LibraryResolver {
  @FieldResolver(() => User)
  async admin(@Root() library: Library, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(library.adminId);
  }

  @Mutation(() => LibraryResponse)
  @UseMiddleware(isAuth)
  async createLibrary(
    @Arg('input') input: LibraryInput,
    @Ctx() { req }: MyContext
  ): Promise<LibraryResponse> {
    const errors = validateLibrary(input);
    if (errors) {
      return { errors };
    }

    let library;
    try {
      library = await Library.create({
        ...input,
        adminId: req.session.userId,
      }).save();
      return { library };
    } catch (err) {
      if (err.code === '23505') {
        throw new Error('you already have library');
        // return {
        //   errors: [
        //     {
        //       field: 'title',
        //       message: 'you already have library',
        //     },
        //   ],
        // };
      }
    }

    return { library };
  }

  // @Mutation(() => Library)
  // updateLibrary(){}

  @Query(() => [Library], { nullable: true })
  async librarys(): Promise<Library[]> {
    const librarys = await Library.find({});

    return librarys;
  }
}
