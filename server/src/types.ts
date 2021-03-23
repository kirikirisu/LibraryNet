import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Field, InputType, ObjectType } from 'type-graphql';
import { createSharedBookLoader } from './loader/createSharedBookLoader';

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  sharedLoader: ReturnType<typeof createSharedBookLoader>;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@InputType()
export class RegisterInput {
  @Field()
  username: string;

  @Field()
  slackId: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  organization: boolean;
}

@InputType()
export class LibraryInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  icon: string;
}
