import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate as dbMigrate } from 'drizzle-orm/node-postgres/migrator';
import * as path from 'path';
import { Pool, PoolConfig } from 'pg';

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_HOST, DATABASE_PORT } =
  process.env;

const migrate = async () => {
  console.log('===== Starting Migration =====');

  const options: PoolConfig = {
    database: DATABASE_NAME || 'eduardomuchak',
    user: DATABASE_USERNAME || 'eduardomuchak',
    max: 1,
    host: DATABASE_HOST || 'db',
    port: parseInt(DATABASE_PORT, 10) || 5432,
  };

  const db: NodePgDatabase<Record<string, never>> = drizzle(new Pool(options));
  await dbMigrate(db, { migrationsFolder: path.join(__dirname, 'migrations') });

  console.log('===== Completed Migration =====');
  process.exit();
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
