import dotenv from 'dotenv';
import chalk from 'chalk';

const { log } = console;

log(`${chalk.bgWhite.black.bold(`Initializing Project Constants`)}`);

// @note Set Node Environment Variable

const NODE_ENV = process.env.NODE_ENV || 'production';
log(`${chalk.bgBlue.black.bold(`Environment`)} ${chalk.white(`${NODE_ENV.toUpperCase()}`)}`);

// @note Initialize Additional Environment Variables

dotenv.config({ path: `.env.${NODE_ENV}` });

// @note Set PostgreSQL Environment Variables

const SERVER_DB_TYPE = process.env.SERVER_DB_TYPE || `postgres`;
const { SERVER_POSTGRES_NAME, SERVER_POSTGRES_USER, SERVER_POSTGRES_PASSWORD } = process.env;

// @note Define Additional Constants

/* eslint-disable @typescript-eslint/naming-convention, no-underscore-dangle */
const __dev__ = NODE_ENV === 'development';
const __prod__ = NODE_ENV === 'production';
/* eslint-enable @typescript-eslint/naming-convention, no-underscore-dangle */

export {
  NODE_ENV,
  SERVER_DB_TYPE,
  SERVER_POSTGRES_NAME,
  SERVER_POSTGRES_USER,
  SERVER_POSTGRES_PASSWORD,
  __dev__,
  __prod__,
};
