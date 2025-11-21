import { type RequestHandler } from 'express';

import { propertyTypeEnum } from '../../database/schema';
import { AppError } from '../../errors/app-error';

import { propertyService } from './property.service';

type CreatePropertyBody = {
  ownerName?: string;
  address?: string;
  type?: string;
  cep?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  observations?: string;
};

type UpdatePropertyBody = Partial<CreatePropertyBody>;

const ensureNonEmptyString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`O campo ${field} é obrigatório.`);
  }

  return value.trim();
};

const ensureValidType = (value: unknown): string => {
  const type = ensureNonEmptyString(value, 'type');
  const allowedTypes = propertyTypeEnum.enumValues;

  if (!allowedTypes.includes(type as (typeof allowedTypes)[number])) {
    throw new AppError(`Tipo de imóvel inválido. Valores permitidos: ${allowedTypes.join(', ')}.`);
  }

  return type;
};

const list: RequestHandler = async (_req, res) => {
  const data = await propertyService.list();
  res.json({ data });
};

const show: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  const data = await propertyService.getById(id);
  res.json({ data });
};

const create: RequestHandler = async (req, res) => {
  const body = req.body as CreatePropertyBody;
  const ownerName = ensureNonEmptyString(body.ownerName, 'ownerName');
  const address = ensureNonEmptyString(body.address, 'address');
  const type = ensureValidType(body.type);
  const cep = ensureNonEmptyString(body.cep, 'cep');
  const street = ensureNonEmptyString(body.street, 'street');
  const number = ensureNonEmptyString(body.number, 'number');
  const district = ensureNonEmptyString(body.district, 'district');
  const city = ensureNonEmptyString(body.city, 'city');
  const state = ensureNonEmptyString(body.state, 'state');
  const observations = body.observations?.trim() || null;

  const data = await propertyService.create({
    ownerName,
    address,
    type,
    cep,
    street,
    number,
    district,
    city,
    state,
    observations,
  });
  res.status(201).json({ data });
};

const update: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  const body = req.body as UpdatePropertyBody;

  const payload: UpdatePropertyBody = {};

  if (body.ownerName !== undefined) {
    payload.ownerName = ensureNonEmptyString(body.ownerName, 'ownerName');
  }

  if (body.address !== undefined) {
    payload.address = ensureNonEmptyString(body.address, 'address');
  }

  if (body.type !== undefined) {
    payload.type = ensureValidType(body.type);
  }

  if (body.cep !== undefined) {
    payload.cep = ensureNonEmptyString(body.cep, 'cep');
  }

  if (body.street !== undefined) {
    payload.street = ensureNonEmptyString(body.street, 'street');
  }

  if (body.number !== undefined) {
    payload.number = ensureNonEmptyString(body.number, 'number');
  }

  if (body.district !== undefined) {
    payload.district = ensureNonEmptyString(body.district, 'district');
  }

  if (body.city !== undefined) {
    payload.city = ensureNonEmptyString(body.city, 'city');
  }

  if (body.state !== undefined) {
    payload.state = ensureNonEmptyString(body.state, 'state');
  }

  if (body.observations !== undefined) {
    payload.observations = body.observations.trim() || null;
  }

  if (Object.keys(payload).length === 0) {
    throw new AppError('Informe ao menos um campo para atualizar.');
  }

  const data = await propertyService.update(id, payload);
  res.json({ data });
};

const remove: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  await propertyService.remove(id);
  res.status(204).send();
};

export const propertyController = {
  list,
  show,
  create,
  update,
  remove,
};

