import { desc, eq } from 'drizzle-orm';

import { db } from '../../config/database';
import { inspections, properties } from '../../database/schema';

import type { CreateInspectionDTO, Inspection, UpdateInspectionDTO } from './inspection.types';
import type { Property } from '../properties/property.types';

export type InspectionWithProperty = Inspection & {
  property: Property | null;
};

const findAll = async (): Promise<InspectionWithProperty[]> => {
  const results = await db
    .select({
      inspection: inspections,
      property: properties,
    })
    .from(inspections)
    .leftJoin(properties, eq(inspections.propertyId, properties.id))
    .orderBy(desc(inspections.scheduledFor));

  return results.map(({ inspection, property }) => ({
    ...inspection,
    property: property ?? null,
  }));
};

const findById = async (id: string): Promise<InspectionWithProperty | null> => {
  const [result] = await db
    .select({
      inspection: inspections,
      property: properties,
    })
    .from(inspections)
    .leftJoin(properties, eq(inspections.propertyId, properties.id))
    .where(eq(inspections.id, id));

  if (!result) {
    return null;
  }

  return {
    ...result.inspection,
    property: result.property ?? null,
  };
};

const create = async (payload: CreateInspectionDTO): Promise<InspectionWithProperty> => {
  const [inspection] = await db
    .insert(inspections)
    .values({
      propertyId: payload.propertyId,
      inspectorName: payload.inspectorName,
      scheduledFor: payload.scheduledFor,
      notes: payload.notes ?? null,
    })
    .returning();

  // Buscar o property associado
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, inspection.propertyId));

  return {
    ...inspection,
    property: property ?? null,
  };
};

const update = async (id: string, payload: UpdateInspectionDTO): Promise<InspectionWithProperty> => {
  // Filtrar campos undefined para evitar atualizações desnecessárias
  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (payload.status !== undefined) {
    updateData.status = payload.status;
    // Se o status for alterado para 'completed', definir completedAt
    if (payload.status === 'completed') {
      updateData.completedAt = new Date();
    }
  }
  if (payload.inspectorName !== undefined) {
    updateData.inspectorName = payload.inspectorName;
  }
  if (payload.scheduledFor !== undefined) {
    updateData.scheduledFor = payload.scheduledFor;
  }
  if (payload.notes !== undefined) {
    updateData.notes = payload.notes;
  }

  const [inspection] = await db
    .update(inspections)
    .set(updateData)
    .where(eq(inspections.id, id))
    .returning();

  if (!inspection) {
    throw new Error('Vistoria não encontrada');
  }

  // Buscar o property associado
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, inspection.propertyId));

  return {
    ...inspection,
    property: property ?? null,
  };
};

export const inspectionRepository = {
  findAll,
  findById,
  create,
  update,
};
