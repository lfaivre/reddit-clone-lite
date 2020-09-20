import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import chalk from 'chalk';
import terminalLink from 'terminal-link';

import {
  __dev__,
  __prod__,
  SERVER_EXPRESS_PORT,
  SERVER_EXPRESS_DOMAIN_DEV,
  SERVER_EXPRESS_DOMAIN_PROD,
  SERVER_GRAPHQL_ENDPOINT,
} from './constants';
import microORMConfig from './mikro-orm.config';
import { PostResolver } from './resolvers/post';

const { log } = console;

log(`\n${chalk.bgWhite.black.bold(`Initializing Project`)}\n`);

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

const main = async (): Promise<void> => {
  const orm = await MikroORM.init(microORMConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(SERVER_EXPRESS_PORT, () => {
    log(`
${chalk.bgGreen.black.bold(`Express Server: Running`)}
${chalk.bgCyan.black.bold(`Port`)} ${chalk.white(`${SERVER_EXPRESS_PORT || `ERROR`}`)}
${chalk.bgMagenta.black.bold(`GraphQL`)} ${chalk.white(
      terminalLink(SERVER_GRAPHQL_ENDPOINT, SERVER_GRAPHQL_ENDPOINT)
    )}
`);
  });
};

main().catch((error) => {
  console.error(`\n${chalk.bgRed.white.bold(`Error`)} ${chalk.white(error)}`);
});
