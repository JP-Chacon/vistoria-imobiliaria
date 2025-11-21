import { eq } from 'drizzle-orm';

import { db } from '../../config/database';
import { users } from '../../database/schema';

import type { CreateUserDTO, User } from './user.types';

const create = async (payload: CreateUserDTO): Promise<User> => {
  const [user] = await db
    .insert(users)
    .values({
      name: payload.name,
      email: payload.email,
      passwordHash: payload.passwordHash,
    })
    .returning();

  return user;
};

const findByEmail = async (email: string): Promise<User | null> => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
};

const findById = async (id: string): Promise<User | null> => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ?? null;
};

export const userRepository = {
  create,
  findByEmail,
  findById,
};

