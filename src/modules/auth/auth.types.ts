import type { PublicUser } from '../users/user.types';

export type RegisterDTO = {
  name: string;
  email: string;
  password: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
};

