import { type RequestHandler } from 'express';

import { AppError } from '../../errors/app-error';

import { inspectionService } from './inspection.service';

type CreateInspectionBody = {
  propertyId?: string;
  inspectorName?: string;
  scheduledFor?: string;
  notes?: string | null;
};

type UpdateInspectionBody = {
  status?: 'pending' | 'scheduled' | 'completed';
  inspectorName?: string;
  scheduledFor?: string;
  notes?: string | null;
};

const parseDate = (value: unknown): Date => {
  if (typeof value !== 'string') {
    throw new AppError('O campo scheduledFor deve ser uma data ISO válida.');
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError('O campo scheduledFor deve ser uma data ISO válida.');
  }

  return date;
};

const ensureNonEmptyString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`O campo ${field} é obrigatório.`);
  }

  return value.trim();
};

const list: RequestHandler = async (_req, res) => {
  const inspections = await inspectionService.list();
  res.json({ data: inspections });
};

const show: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  const inspection = await inspectionService.getById(id);
  res.json({ data: inspection });
};

const create: RequestHandler = async (req, res) => {
  const body = req.body as CreateInspectionBody;

  const propertyId = ensureNonEmptyString(body.propertyId, 'propertyId');
  const inspectorName = ensureNonEmptyString(body.inspectorName, 'inspectorName');
  const scheduledFor = parseDate(body.scheduledFor);
  const trimmedNotes = typeof body.notes === 'string' ? body.notes.trim() : null;
  const notes = trimmedNotes ? trimmedNotes : null;

  const inspection = await inspectionService.create({
    propertyId,
    inspectorName,
    scheduledFor,
    notes,
  });

  res.status(201).json({ data: inspection });
};

const update: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  const body = req.body as UpdateInspectionBody;

  const updateData: {
    status?: 'pending' | 'scheduled' | 'completed';
    inspectorName?: string;
    scheduledFor?: Date;
    notes?: string | null;
  } = {};

  if (body.status) {
    if (!['pending', 'scheduled', 'completed'].includes(body.status)) {
      throw new AppError('Status inválido. Use: pending, scheduled ou completed.');
    }
    updateData.status = body.status;
  }

  if (body.inspectorName !== undefined && body.inspectorName.trim()) {
    updateData.inspectorName = body.inspectorName.trim();
  }

  if (body.scheduledFor) {
    updateData.scheduledFor = parseDate(body.scheduledFor);
  }

  if (body.notes !== undefined) {
    const trimmedNotes = typeof body.notes === 'string' ? body.notes.trim() : null;
    updateData.notes = trimmedNotes || null;
  }

  // Verificar se há pelo menos um campo para atualizar
  if (Object.keys(updateData).length === 0) {
    throw new AppError('Nenhum campo foi fornecido para atualização.');
  }

  const inspection = await inspectionService.update(id, updateData);

  res.json({ data: inspection });
};

export const inspectionController = {
  list,
  show,
  create,
  update,
};

