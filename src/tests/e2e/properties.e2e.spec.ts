import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { app } from '../../app';
import { propertyService } from '../../modules/properties/property.service';

vi.mock('../../middlewares/auth-middleware', () => ({
  authMiddleware: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('../../modules/properties/property.service', () => ({
  propertyService: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('Properties E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/properties deve criar imóvel', async () => {
    vi.mocked(propertyService.create).mockResolvedValue({
      id: 'property-1',
      ownerName: 'João',
      address: 'Rua A',
      type: 'house',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const response = await request(app)
      .post('/api/properties')
      .set('Authorization', 'Bearer token')
      .send({
        ownerName: 'João',
        address: 'Rua A',
        type: 'house',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe('property-1');
  });
});

