import { MikroORM } from '@mikro-orm/core';
import chalk from 'chalk';

import microORMConfig from './mikro-orm.config';
import { Post } from './entities/Post';

const { log } = console;

log(`${chalk.bgWhite.black.bold(`Initializing Project`)}`);

const main = async (): Promise<void> => {
  const orm = await MikroORM.init(microORMConfig);
  await orm.getMigrator().up();

  // @temp Testing
  const post = orm.em.create(Post, { title: 'First Post' });
  await orm.em.persistAndFlush(post);
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`
  \n${chalk.bgRed.white.bold(`Error`)} ${chalk.white(error)}
  `);
});
