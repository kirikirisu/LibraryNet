import { isAuth } from '../middleware/isAuth';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { FieldError, LibraryInput, MyContext } from '../types';
import { Library } from '../entities/Library';
import { validateLibrary } from '../utils/validateLibrary';

@ObjectType()
class LibraryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Library, { nullable: true })
  library?: Library;
}
// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Resolver()
export class LibraryResolver {
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
  async librarys() {
    const librarys = await Library.find({});
    console.log(librarys);

    return librarys;
  }
}
