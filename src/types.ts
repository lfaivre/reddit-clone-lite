import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

export type Context = {
  em: EntityManager<never> & EntityManager<IDatabaseDriver<Connection>>;
};
