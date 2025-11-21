import { type RequestHandler } from 'express';

import { AppError } from '../../errors/app-error';

import { userRepository } from './user.repository';
import type { PublicUser } from './user.types';

const getCurrentUser: RequestHandler = async (req, res) => {
  if (!req.user?.id) {
    throw new AppError('Usuário não autenticado.', 401);
  }

  const user = await userRepository.findById(req.user.id);

  if (!user) {
    throw new AppError('Usuário não encontrado.', 404);
  }

  // Retorna apenas os dados públicos do usuário (sem passwordHash)
  const publicUser: PublicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.json({ data: publicUser });
};

export const userController = {
  getCurrentUser,
};

