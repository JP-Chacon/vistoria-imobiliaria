import { type RequestHandler } from 'express';

import { AppError } from '../../errors/app-error';

import { authService } from './auth.service';

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

const ensureNonEmptyString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError(`O campo ${field} é obrigatório.`);
  }

  return value.trim();
};

const validateEmail = (value: string) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new AppError('E-mail inválido.');
  }

  return value.toLowerCase();
};

const register: RequestHandler = async (req, res) => {
  const body = req.body as RegisterBody;
  const name = ensureNonEmptyString(body.name, 'name');
  const email = validateEmail(ensureNonEmptyString(body.email, 'email'));
  const password = ensureNonEmptyString(body.password, 'password');

  const result = await authService.register({ name, email, password });
  res.status(201).json({ data: result });
};

const login: RequestHandler = async (req, res) => {
  const body = req.body as LoginBody;
  const email = validateEmail(ensureNonEmptyString(body.email, 'email'));
  const password = ensureNonEmptyString(body.password, 'password');

  const result = await authService.login({ email, password });
  res.json({ data: result });
};

export const authController = {
  register,
  login,
};

