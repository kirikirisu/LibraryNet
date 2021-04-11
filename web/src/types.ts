import { Book, User } from './generated/graphql';

export type HandyBook = Pick<
  Book,
  'id' | 'title' | 'description' | 'img' | 'inforLink' | 'available'
>;
