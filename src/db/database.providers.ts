import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';

import * as mainSchema from './schema';
import { ConfigService } from '../config/config.service';

const schema = { ...mainSchema };

export type DB = NodePgDatabase<typeof schema>;
export const DB_PROVIDER = 'DB_PROVIDER';

export const databaseProviders = [
  {
    provide: DB_PROVIDER,
    inject: [ConfigService],
    useFactory: async (config: ConfigService): Promise<DB> => {
      const options: PoolConfig = {
        host: config.database.host,
        port: config.database.port,
      };

      return drizzle(new Pool(options), { schema, logger: config.app.isLocal });
    },
  },
];
