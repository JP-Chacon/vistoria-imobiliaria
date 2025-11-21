import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppError } from '../../../errors/app-error';
import { userRepository } from '../../users/user.repository';
import { authService } from '../auth.service';

vi.mock('../../users/user.repository', () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(jwt, 'sign').mockReturnValue('signed-token');
  });

  it('deve impedir cadastro com e-mail duplicado', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 'user-1',
    } as never);

    await expect(
      authService.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('deve autenticar usuário com credenciais válidas', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const result = await authService.login({
      email: 'john@example.com',
      password: '123456',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user.email).toBe('john@example.com');
  });
});

