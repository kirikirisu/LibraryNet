import 'reflect-metadata';
import dotenv from 'dotenv';
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
import { SharedBook } from './entities/SharedBook';
import { createSharedBookLoader } from './loader/createSharedBookLoader';
import { slack } from './handler/slack';

const main = async () => {
  dotenv.config();
  const conn = await createConnection({
    type: 'postgres',
    database: process.env.DB_NAME,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
    entities: [User, Library, Book, SharedBook],
  });

  // await User.delete({});
  // console.log(process.env.DB_NAME)

  // conn.createQueryBuilder()
  //     .createQueryBuilder()
  //     .delete()
  //     .from(SharedBook)
  //     .where("bookId = :id", {id: 15})
  //     .execute()

  // conn.createQueryBuilder()
  //   .createQueryBuilder()
  //   .update(Book)
  //   .set({
  //     available: "valid"
  //   })
  //   .where("id = :id", {id: 17})
  //   .execute()

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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
      sharedLoader: createSharedBookLoader(),
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.get('/', (_, res) => {
    res.send('OK. server working!!');
  });

  app.post('/', async (req, res) => {
    const status = await slack(req, res);
    console.log('slackHandlerStatus', status);
  });

  app.listen(4000, () => {
    console.log('server start on port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
