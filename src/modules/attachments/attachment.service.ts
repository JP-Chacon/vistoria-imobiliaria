import { promises as fs } from 'node:fs';

import { AppError } from '../../errors/app-error';
import { inspectionService } from '../inspections/inspection.service';

import { attachmentRepository } from './attachment.repository';
import type { Attachment } from './attachment.types';

const listByInspection = async (inspectionId: string): Promise<Attachment[]> => {
  await inspectionService.ensureExists(inspectionId);
  return attachmentRepository.findByInspectionId(inspectionId);
};

const createFromFiles = async (
  inspectionId: string,
  files: Express.Multer.File[],
): Promise<Attachment[]> => {
  await inspectionService.ensureExists(inspectionId);

  const payload = files.map((file) => ({
    inspectionId,
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    path: file.path,
  }));

  return attachmentRepository.createMany(payload);
};

const remove = async (id: string): Promise<void> => {
  const attachment = await attachmentRepository.remove(id);

  if (!attachment) {
    throw new AppError('Anexo não encontrado.', 404);
  }

  await fs.rm(attachment.path).catch(() => undefined);
};

export const attachmentService = {
  listByInspection,
  createFromFiles,
  remove,
};

