import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { app } from '../../app';
import { inspectionService } from '../../modules/inspections/inspection.service';

vi.mock('../../middlewares/auth-middleware', () => ({
  authMiddleware: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('../../modules/inspections/inspection.service', () => ({
  inspectionService: {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    ensureExists: vi.fn(),
  },
}));

describe('Inspections E2E', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('POST /api/inspections deve criar vistoria', async () => {
    const payload = {
      propertyId: 'property-1',
      inspectorName: 'Inspector',
      scheduledFor: new Date().toISOString(),
      notes: 'Notas',
    };

    vi.mocked(inspectionService.create).mockResolvedValue({
      id: 'inspection-1',
      propertyId: payload.propertyId,
      inspectorName: payload.inspectorName,
      scheduledFor: new Date(payload.scheduledFor),
      notes: payload.notes,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const response = await request(app)
      .post('/api/inspections')
      .set('Authorization', 'Bearer token')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe('inspection-1');
  });
});

