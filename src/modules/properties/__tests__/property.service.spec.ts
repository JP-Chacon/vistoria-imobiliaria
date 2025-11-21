import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppError } from '../../../errors/app-error';
import { propertyRepository } from '../property.repository';
import { propertyService } from '../property.service';

vi.mock('../property.repository', () => ({
  propertyRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('propertyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve lançar erro ao buscar imóvel inexistente', async () => {
    vi.mocked(propertyRepository.findById).mockResolvedValue(null);

    await expect(propertyService.getById('invalid')).rejects.toBeInstanceOf(AppError);
  });

  it('deve criar um imóvel válido', async () => {
    const payload = {
      ownerName: 'Maria',
      address: 'Rua 1',
      type: 'house',
    };

    vi.mocked(propertyRepository.create).mockResolvedValue({
      id: 'property-1',
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const property = await propertyService.create(payload);
    expect(property.id).toBe('property-1');
    expect(propertyRepository.create).toHaveBeenCalledWith(payload);
  });
});

