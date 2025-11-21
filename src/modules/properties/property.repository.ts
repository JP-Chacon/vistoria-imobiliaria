import { eq } from 'drizzle-orm';

import { db } from '../../config/database';
import { properties } from '../../database/schema';

import type {
  CreatePropertyDTO,
  Property,
  UpdatePropertyDTO,
} from './property.types';

const findAll = async (): Promise<Property[]> => {
  return db.select().from(properties).orderBy(properties.createdAt);
};

const findById = async (id: string): Promise<Property | null> => {
  const [property] = await db.select().from(properties).where(eq(properties.id, id));
  return property ?? null;
};

const create = async (payload: CreatePropertyDTO): Promise<Property> => {
  const [property] = await db
    .insert(properties)
    .values({
      ownerName: payload.ownerName,
      address: payload.address,
      type: payload.type,
      cep: payload.cep,
      street: payload.street,
      number: payload.number,
      district: payload.district,
      city: payload.city,
      state: payload.state,
      observations: payload.observations ?? null,
    })
    .returning();

  return property;
};

const update = async (id: string, payload: UpdatePropertyDTO): Promise<Property | null> => {
  const [property] = await db
    .update(properties)
    .set(payload)
    .where(eq(properties.id, id))
    .returning();

  return property ?? null;
};

const remove = async (id: string): Promise<void> => {
  await db.delete(properties).where(eq(properties.id, id));
};

export const propertyRepository = {
  findAll,
  findById,
  create,
  update,
  remove,
};

