import type { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';

import { env } from '../config/env';
import { AppError } from '../errors/app-error';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof MulterError) {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error('[error]', error);

  const stack = error instanceof Error ? error.stack : undefined;
  const stackPayload = env.isDevelopment && stack ? { stack } : {};

  return res.status(500).json({
    message: 'Erro interno no servidor',
    ...stackPayload,
  });
};

