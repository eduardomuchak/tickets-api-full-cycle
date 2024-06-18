import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate as dbMigrate } from 'drizzle-orm/node-postgres/migrator';
import * as path from 'path';
import { Pool, PoolConfig } from 'pg';

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

const migrate = async () => {
  console.log('===== Starting Migration =====');

  const options: PoolConfig = {
    database: DATABASE_NAME || 'db_full_cycle',
    user: DATABASE_USERNAME || 'root',
    password: DATABASE_PASSWORD || 'senha123',
    max: 1,
    host: 'localhost',
    port: 8080,
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
