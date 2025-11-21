import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { users } from '../../database/schema';

export type User = InferSelectModel<typeof users>;
export type CreateUserDTO = Omit<
  InferInsertModel<typeof users>,
  'id' | 'createdAt' | 'updatedAt'
>;

export type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'createdAt' | 'updatedAt'>;

