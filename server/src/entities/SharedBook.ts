import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

@ObjectType()
@Entity()
export class SharedBook extends BaseEntity {
  @Field()
  @PrimaryColumn()
  publisherId!: number;

  @ManyToOne(() => User, user => user.booksYouPublish)
  publisher!: User

  @Field()
  @PrimaryColumn()
  subscriberId!: number;

  @ManyToOne(() => User, user => user.booksYouSubscribe)
  subscriber!: User

  @Field()
  @PrimaryColumn()
  bookId!: number;

  @ManyToOne(() => Book, book => book.shares)
  book: Book;

}
