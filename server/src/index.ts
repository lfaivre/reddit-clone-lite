import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import chalk from 'chalk';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import terminalLink from 'terminal-link';
import { buildSchema } from 'type-graphql';
import {
  COOKIE_NAME,
  SERVER_EXPRESS_DOMAIN_DEV,
  SERVER_EXPRESS_DOMAIN_PROD,
  SERVER_EXPRESS_PORT,
  SERVER_GRAPHQL_ENDPOINT,
  SERVER_REDIS_SECRET,
  __dev__,
  __prod__,
} from './constants';
import microORMConfig from './mikro-orm.config';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

const { log } = console;

const main = async (): Promise<void> => {
  log(`\n${chalk.bgWhite.black.bold(`Initializing Project`)}\n`);

  if (!SERVER_REDIS_SECRET) {
    const errorMessage = `Missing Redis environment variables`;
    console.error(`\n${chalk.bgRed.white.bold(`Error`)} ${chalk.white(errorMessage)}\n`);
    throw new Error(errorMessage);
  }

  if (
    !SERVER_EXPRESS_PORT ||
    (__dev__ && !SERVER_EXPRESS_DOMAIN_DEV) ||
    (__prod__ && !SERVER_EXPRESS_DOMAIN_PROD) ||
    !SERVER_GRAPHQL_ENDPOINT
  ) {
    const errorMessage = `Missing Express environment variables`;
    console.error(`\n${chalk.bgRed.white.bold(`Error`)} ${chalk.white(errorMessage)}\n`);
    throw new Error(errorMessage);
  }

  const orm = await MikroORM.init(microORMConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: `http://localhost:3000`,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: `lax`,
        secure: __prod__,
      },
      secret: SERVER_REDIS_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(SERVER_EXPRESS_PORT, () => {
    log(`
${chalk.bgGreen.black.bold(`Express Server: Running`)}
${chalk.bgCyan.black.bold(`Port`)} ${chalk.white(`${SERVER_EXPRESS_PORT || `ERROR`}`)}
${chalk.bgMagenta.black.bold(`GraphQL`)} ${chalk.white(terminalLink(SERVER_GRAPHQL_ENDPOINT, SERVER_GRAPHQL_ENDPOINT))}
`);
  });
};

main().catch((error) => {
  console.error(`\n${chalk.bgRed.white.bold(`Error`)} ${chalk.white(error)}`);
});
