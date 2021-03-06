import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Book } from "./Book";
import { User } from "./User";

@ObjectType()
@Entity()
export class Library extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  description!: string;

  @Field()
  @Column()
  icon!: string;

  @Field()
  @Column()
  organization!: boolean;

  @Field()
  @Column()
  ownerId: number;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToMany(() => Book, (book) => book.library)
  books: Book[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
