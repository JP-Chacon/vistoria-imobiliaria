import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { AppError } from '../errors/app-error';

type JwtPayload = {
  sub: string;
};

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    throw new AppError('Token não informado.', 401);
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = { id: payload.sub };
    next();
  } catch {
    throw new AppError('Token inválido.', 401);
  }
};

