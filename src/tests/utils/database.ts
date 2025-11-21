import { existsSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db, pool } from '../../config/database';
import { attachments, inspections, properties, users } from '../../database/schema';
import { uploadsRoot } from '../../config/upload';

const migrationsFolder = path.resolve(process.cwd(), 'migrations');

export const runMigrations = async (): Promise<void> => {
  await migrate(db, { migrationsFolder });
};

export const resetDatabase = async (): Promise<void> => {
  await db.delete(attachments);
  await db.delete(inspections);
  await db.delete(properties);
  await db.delete(users);
  await resetUploads();
};

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
};

const resetUploads = async (): Promise<void> => {
  if (!existsSync(uploadsRoot)) {
    await fs.mkdir(uploadsRoot, { recursive: true });
    return;
  }

  const entries = await fs.readdir(uploadsRoot, { withFileTypes: true });

  await Promise.all(
    entries.map((entry) =>
      fs.rm(path.join(uploadsRoot, entry.name), {
        recursive: entry.isDirectory(),
        force: true,
      }),
    ),
  );
};


