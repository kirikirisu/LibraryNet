import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Book } from './Book';
import { User } from './User';

@ObjectType()
@Entity()
export class SharedBook extends BaseEntity {
  @Field()
  @Column()
  publisherId!: number;

  @ManyToOne(() => User, (user) => user.booksYouPublish, {
    onDelete: 'CASCADE',
  })
  publisher!: User;

  @Field()
  @Column()
  subscriberId!: number;

  @ManyToOne(() => User, (user) => user.booksYouSubscribe, {
    onDelete: 'CASCADE',
  })
  subscriber!: User;

  @Field()
  @PrimaryColumn()
  bookId!: number;

  @ManyToOne(() => Book, (book) => book.shares, { onDelete: 'CASCADE' })
  book: Book;
}
