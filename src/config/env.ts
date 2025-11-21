import 'dotenv/config';

type RequiredEnv = 'DATABASE_URL' | 'JWT_SECRET';

const ensure = (key: RequiredEnv, fallback?: string): string => {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Variável de ambiente ${key} não definida.`);
  }

  return value;
};

const port = Number(process.env.PORT ?? '3333');

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isDevelopment: (process.env.NODE_ENV ?? 'development') === 'development',
  port,
  databaseUrl: ensure('DATABASE_URL'),
  jwtSecret: ensure('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
};
