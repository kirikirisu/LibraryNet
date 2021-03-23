import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../entities/User';
import { SharedBook } from './SharedBook';

@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  img!: string;

  @Field()
  @Column()
  inforLink!: string;

  @Field()
  @Column()
  available!: 'valid' | 'asking' | 'invalid';

  @Field()
  @Column()
  ownerId!: number;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => SharedBook, (sharedBook) => sharedBook.book)
  shares: SharedBook[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
