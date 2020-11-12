/* eslint-disable @typescript-eslint/restrict-template-expressions, no-underscore-dangle */

import chalk from 'chalk';
import dotenv from 'dotenv';

const { log } = console;

log(`${chalk.bgWhite.black.bold(`Initializing Project Constants`)}`);

// @note Set Node Environment Variable

export const NODE_ENV = process.env.NODE_ENV || 'production';
log(`${chalk.bgCyan.black.bold(`Environment`)} ${chalk.white(`${NODE_ENV.toUpperCase()}`)}`);
export const __dev__ = NODE_ENV === 'development';
export const __prod__ = NODE_ENV === 'production';

// @note Initialize Additional Environment Variables

dotenv.config({ path: `.env.${NODE_ENV}` });

// @note Set PostgreSQL Environment Variables

export const SERVER_DB_TYPE = process.env.SERVER_DB_TYPE || `postgres`;
export const { SERVER_POSTGRES_NAME, SERVER_POSTGRES_USER, SERVER_POSTGRES_PASSWORD } = process.env;

// @note Set Redis Environment Variables

export const { SERVER_REDIS_HOSTNAME, SERVER_REDIS_PORT, SERVER_REDIS_SECRET } = process.env;

// @note Set Express Environment Variables

export const { SERVER_EXPRESS_PORT, SERVER_EXPRESS_DOMAIN_DEV, SERVER_EXPRESS_DOMAIN_PROD } = process.env;

// @note Define Additional Constants

export const SERVER_GRAPHQL_ENDPOINT = __dev__
  ? `http://${SERVER_EXPRESS_DOMAIN_DEV}:${SERVER_EXPRESS_PORT}/graphql`
  : __prod__
  ? `http://${SERVER_EXPRESS_DOMAIN_PROD}:${SERVER_EXPRESS_PORT}/graphql`
  : `localhost`;

/* eslint-enable @typescript-eslint/restrict-template-expressions, no-underscore-dangle */
