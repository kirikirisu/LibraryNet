import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import cors from 'cors';

import { User } from './entities/User';
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './resolvers/user';
import { COOKIE_NAME, __prod__ } from './constants';
import { Library } from './entities/Library';
import { LibraryResolver } from './resolvers/library';
import { BookResolver } from './resolvers/book';
import { Book } from './entities/Book';

const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'librarynet',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    synchronize: true,
    entities: [User, Library, Book],
  });

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 3, // 3 month
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      },
      saveUninitialized: false,
      secret: 'hkjdfjkdffiio',
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, LibraryResolver, BookResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log('server start on port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
