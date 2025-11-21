import { AppError } from '../../errors/app-error';

import { propertyRepository } from './property.repository';
import type { CreatePropertyDTO, Property, UpdatePropertyDTO } from './property.types';

const list = () => propertyRepository.findAll();

const getById = async (id: string): Promise<Property> => {
  const property = await propertyRepository.findById(id);

  if (!property) {
    throw new AppError('Imóvel não encontrado.', 404);
  }

  return property;
};

const create = (payload: CreatePropertyDTO) => propertyRepository.create(payload);

const update = async (id: string, payload: UpdatePropertyDTO) => {
  const property = await propertyRepository.update(id, payload);

  if (!property) {
    throw new AppError('Imóvel não encontrado.', 404);
  }

  return property;
};

const remove = async (id: string): Promise<void> => {
  const property = await propertyRepository.findById(id);

  if (!property) {
    throw new AppError('Imóvel não encontrado.', 404);
  }

  await propertyRepository.remove(id);
};

export const propertyService = {
  list,
  getById,
  create,
  update,
  remove,
};

