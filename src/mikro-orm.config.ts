// @docs https://mikro-orm.io/docs/installation

import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import chalk from 'chalk';

import {
  SERVER_DB_TYPE,
  SERVER_POSTGRES_NAME,
  SERVER_POSTGRES_USER,
  SERVER_POSTGRES_PASSWORD,
  __dev__,
} from './constants';
import { Post } from './entities/Post';

const { log, error } = console;

if (
  !SERVER_DB_TYPE ||
  !SERVER_POSTGRES_NAME ||
  !SERVER_POSTGRES_USER ||
  !SERVER_POSTGRES_PASSWORD
) {
  const errorMessage = `Missing PostgreSQL environment variables`;
  error(`
  \n${chalk.bgRed.white.bold(`Error`)} ${chalk.white(errorMessage)}\n
  `);
  throw new Error(errorMessage);
}

const MikroORMConfig = {
  migrations: {
    path: path.join(__dirname, `./migrations`),
    pattern: /^[\w-]+\d+\.[jt]s$/,
  },
  entities: [Post],
  type: SERVER_DB_TYPE,
  dbName: SERVER_POSTGRES_NAME,
  user: SERVER_POSTGRES_USER,
  password: SERVER_POSTGRES_PASSWORD,
  baseDir: __dirname,
  debug: __dev__,
} as Parameters<typeof MikroORM.init>[0];

log(`
${chalk.magenta.bold(`MikroORM Configuration`)}\n
${JSON.stringify(MikroORMConfig, null, 2)}
`);

// eslint-disable-next-line import/no-default-export
export default MikroORMConfig;
