import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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
  libraryId: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
