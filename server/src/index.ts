import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";

import { User } from "./entities/User";
import { Book } from "./entities/Book";
import { ApolloServer } from "apollo-server-express";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import { COOKIE_NAME, __prod__ } from "./constants";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "librarynet",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [User, Book],
  });

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 3, // 3 month
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "hkjdfjkdff",
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server start on port 4000");
    console.log("node-env", process.env.NODE_ENV);
  });
};

main().catch((err) => {
  console.log(err);
});
