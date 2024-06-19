import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate as dbMigrate } from 'drizzle-orm/node-postgres/migrator';
import * as path from 'path';
import { Pool, PoolConfig } from 'pg';

const { DATABASE_NAME, DATABASE_USERNAME, DATABASE_HOST, DATABASE_PORT } =
  process.env;

const connectWithRetry = async (
  options: PoolConfig,
  retries = 5,
  delay = 5000,
) => {
  for (let i = 0; i < retries; i++) {
    try {
      const pool = new Pool(options);
      await pool.query('SELECT 1');
      return pool;
    } catch (err) {
      console.error(
        `Attempt ${i + 1} to connect to database failed. Retrying in ${delay / 1000} seconds...`,
        err,
      );
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error('Failed to connect to the database after multiple attempts');
};

const migrate = async () => {
  console.log('===== Starting Migration =====');

  const options: PoolConfig = {
    database: DATABASE_NAME || 'eduardomuchak',
    user: DATABASE_USERNAME || 'eduardomuchak',
    max: 1,
    host: DATABASE_HOST || 'db',
    port: parseInt(DATABASE_PORT, 10) || 5432,
  };

  const pool = await connectWithRetry(options);
  const db: NodePgDatabase<Record<string, never>> = drizzle(pool);

  await dbMigrate(db, { migrationsFolder: path.join(__dirname, 'migrations') });

  console.log('===== Completed Migration =====');
  process.exit();
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
