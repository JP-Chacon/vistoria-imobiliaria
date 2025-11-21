import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { app } from '../../app';
import { authService } from '../../modules/auth/auth.service';

vi.mock('../../modules/auth/auth.service', () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
  },
}));

describe('Auth E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/auth/register deve criar usuário', async () => {
    vi.mocked(authService.register).mockResolvedValue({
      user: {
        id: 'user-1',
        name: 'John',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      accessToken: 'token',
    });

    const response = await request(app).post('/api/auth/register').send({
      name: 'John',
      email: 'john@example.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body.data.accessToken).toBe('token');
  });

  it('POST /api/auth/login deve autenticar usuário', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      user: {
        id: 'user-1',
        name: 'John',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      accessToken: 'token',
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'john@example.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe('john@example.com');
  });
});

