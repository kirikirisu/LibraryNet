import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Book } from "./Book";
import { SharedBook } from "./SharedBook";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column()
  password!: string;

  @Field()
  @Column()
  organization!: boolean;

  @OneToMany(() => Book, (book) => book.owner)
  books: Book[];

  @OneToMany(() => SharedBook, sharedBook => sharedBook.publisher)
  booksYouPublish: Book[];

  @OneToMany(() => SharedBook, sharedBook => sharedBook.subscriber)
  booksYouSubscribe: Book[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
