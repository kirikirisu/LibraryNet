import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Book } from "./entities/Book";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
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
  });
};

main().catch((err) => {
  console.log(err);
});
