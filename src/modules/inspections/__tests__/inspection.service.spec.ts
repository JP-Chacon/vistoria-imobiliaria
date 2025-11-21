import { describe, expect, it, vi, beforeEach } from 'vitest';

import { AppError } from '../../../errors/app-error';
import { propertyService } from '../../properties/property.service';
import { inspectionRepository } from '../inspection.repository';
import { inspectionService } from '../inspection.service';

vi.mock('../inspection.repository', () => ({
  inspectionRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../../properties/property.service', () => ({
  propertyService: {
    getById: vi.fn(),
  },
}));

describe('inspectionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(propertyService.getById).mockResolvedValue({
      id: 'property-1',
    } as never);
  });

  it('deve lançar erro quando vistoria não existir', async () => {
    vi.mocked(inspectionRepository.findById).mockResolvedValue(null);

    await expect(inspectionService.getById('unknown')).rejects.toBeInstanceOf(AppError);
  });

  it('deve criar uma nova vistoria após validar o imóvel', async () => {
    const payload = {
      propertyId: 'property-1',
      inspectorName: 'Inspector',
      scheduledFor: new Date(),
      notes: 'notes',
    };

    vi.mocked(inspectionRepository.create).mockResolvedValue({
      id: 'inspection-1',
      ...payload,
      status: 'pending',
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const inspection = await inspectionService.create(payload);

    expect(inspectionRepository.create).toHaveBeenCalledWith(payload);
    expect(inspection.id).toBe('inspection-1');
  });
});

