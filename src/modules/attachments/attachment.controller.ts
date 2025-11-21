import { type RequestHandler } from 'express';

import { AppError } from '../../errors/app-error';

import { attachmentService } from './attachment.service';

const listByInspection: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  const data = await attachmentService.listByInspection(id);
  res.json({ data });
};

const upload: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    throw new AppError('Nenhum arquivo enviado.');
  }

  const data = await attachmentService.createFromFiles(id, files);
  res.status(201).json({ data });
};

const remove: RequestHandler = async (req, res) => {
  const { id } = req.params as { id: string };
  await attachmentService.remove(id);
  res.status(204).send();
};

export const attachmentController = {
  listByInspection,
  upload,
  remove,
};

