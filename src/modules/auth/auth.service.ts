import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env';
import { AppError } from '../../errors/app-error';
import { userRepository } from '../users/user.repository';
import type { PublicUser, User } from '../users/user.types';

import type { AuthResponse, LoginDTO, RegisterDTO } from './auth.types';

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const generateToken = (userId: string) => {
  return jwt.sign({}, env.jwtSecret, {
    subject: userId,
    expiresIn: env.jwtExpiresIn,
  });
};

const register = async (payload: RegisterDTO): Promise<AuthResponse> => {
  const email = payload.email.toLowerCase();

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError('E-mail já cadastrado.', 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await userRepository.create({
    name: payload.name,
    email,
    passwordHash,
  });

  return {
    user: toPublicUser(user),
    accessToken: generateToken(user.id),
  };
};

const login = async (payload: LoginDTO): Promise<AuthResponse> => {
  const email = payload.email.toLowerCase();

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  return {
    user: toPublicUser(user),
    accessToken: generateToken(user.id),
  };
};

export const authService = {
  register,
  login,
};

