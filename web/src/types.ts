import { Book, User } from './generated/graphql';

export type RegularBook = Pick<
  Book,
  'id' | 'title' | 'description' | 'img' | 'inforLink' | 'available'
>;

export type RegularUser = Pick<User, 'id' | 'username'>;

export type BookAvailable = 'all' | 'valid' | 'asking' | 'invalid';
