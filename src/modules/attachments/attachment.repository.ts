import { eq } from 'drizzle-orm';

import { db } from '../../config/database';
import { attachments } from '../../database/schema';

import type { Attachment, CreateAttachmentDTO } from './attachment.types';

const findByInspectionId = async (inspectionId: string): Promise<Attachment[]> => {
  return db.select().from(attachments).where(eq(attachments.inspectionId, inspectionId));
};

const findById = async (id: string): Promise<Attachment | null> => {
  const [attachment] = await db.select().from(attachments).where(eq(attachments.id, id));
  return attachment ?? null;
};

const createMany = async (payload: CreateAttachmentDTO[]): Promise<Attachment[]> => {
  if (payload.length === 0) {
    return [];
  }

  return db.insert(attachments).values(payload).returning();
};

const remove = async (id: string): Promise<Attachment | null> => {
  const [attachment] = await db.delete(attachments).where(eq(attachments.id, id)).returning();
  return attachment ?? null;
};

export const attachmentRepository = {
  findByInspectionId,
  findById,
  createMany,
  remove,
};

