import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Field, InputType, ObjectType } from 'type-graphql';

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@InputType()
export class LibraryInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  icon: string;

  @Field()
  organization: boolean;
}
