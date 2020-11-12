import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import chalk from 'chalk';
import terminalLink from 'terminal-link';

import {
  __dev__,
  __prod__,
  SERVER_REDIS_SECRET,
  SERVER_EXPRESS_PORT,
  SERVER_EXPRESS_DOMAIN_DEV,
  SERVER_EXPRESS_DOMAIN_PROD,
  SERVER_GRAPHQL_ENDPOINT,
} from './constants';
import microORMConfig from './mikro-orm.config';

import { Context } from './types';
import { UserResolver } from './resolvers/user';
import { PostResolver } from './resolvers/post';

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
  const redisClient = redis.createClient();
  app.use(
    session({
      name: `qid`,
      store: new RedisStore({
        client: redisClient,
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
    context: ({ req, res }): Context => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

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
