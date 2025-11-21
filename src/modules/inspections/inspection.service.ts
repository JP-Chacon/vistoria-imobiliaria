import { AppError } from '../../errors/app-error';
import { propertyService } from '../properties/property.service';

import { inspectionRepository } from './inspection.repository';
import type { CreateInspectionDTO, UpdateInspectionDTO } from './inspection.types';

const ensureExists = async (id: string) => {
  const inspection = await inspectionRepository.findById(id);

  if (!inspection) {
    throw new AppError('Vistoria não encontrada', 404);
  }

  return inspection;
};

const list = () => inspectionRepository.findAll();

const getById = (id: string) => ensureExists(id);

const create = async (payload: CreateInspectionDTO) => {
  await propertyService.getById(payload.propertyId);
  return inspectionRepository.create(payload);
};

const update = async (id: string, payload: UpdateInspectionDTO) => {
  await ensureExists(id);
  return inspectionRepository.update(id, payload);
};

export const inspectionService = {
  list,
  getById,
  create,
  update,
  ensureExists,
};

