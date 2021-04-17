import 'reflect-metadata';
import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import express from 'express';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import cors from 'cors';
import path from 'path';

import { User } from './entities/User';
import { ApolloServer } from 'apollo-server-express';
import { UserResolver } from './resolvers/user';
import { COOKIE_NAME, isContainer } from './constants';
import { Library } from './entities/Library';
import { LibraryResolver } from './resolvers/library';
import { BookResolver } from './resolvers/book';
import { Book } from './entities/Book';
import { SharedBook } from './entities/SharedBook';
import { createSubscriberLoader } from './loader/createSubscriberLoader';
import { createAdminLoader } from './loader/createAdminLoader';
import { slack } from './handler/slack';

const main = async () => {
  dotenv.config();
  console.log(process.env.NODE_ENV);
  console.log(process.env.CONTAINER_DATABASE_URL);

  await createConnection({
    type: 'postgres',
    url: isContainer()
      ? process.env.CONTAINER_DATABASE_URL
      : process.env.LOCAL_DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [User, Library, Book, SharedBook],
  });

  // await conn.runMigrations();

  // await User.delete({});

  // await conn
  //   .createQueryBuilder()
  //   .createQueryBuilder()
  //   .delete()
  //   .from(SharedBook)
  //   .where('bookId = :id', { id: 20 })
  //   .execute();

  // await conn
  //   .createQueryBuilder()
  //   .createQueryBuilder()
  //   .update(Book)
  //   .set({
  //     available: 'valid',
  //   })
  //   .where('id = :id', { id: 20 })
  //   .execute();

  const app = express();
  const RedisStore = connectRedis(session);
  const redisHost = isContainer()
    ? `${process.env.CONTAINER_REDIS_HOST}`
    : `${process.env.LOCAL_REDIS_HOST}`;
  const redis = new Redis(6379, redisHost);

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
      subscriberLoader: createSubscriberLoader(),
      adminLoader: createAdminLoader(),
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.get('/', (_, res) => {
    res.send('OK. server working!!');
  });

  app.post('/', async (req) => {
    const status = await slack(req);
    console.log('slackHandlerStatus', status);
  });

  app.listen(4000, () => {
    console.log('server start on port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
