import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { properties, propertyTypeEnum } from '../../database/schema';

export type Property = InferSelectModel<typeof properties>;
export type CreatePropertyDTO = Omit<
  InferInsertModel<typeof properties>,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdatePropertyDTO = Partial<CreatePropertyDTO>;
export type PropertyType = (typeof propertyTypeEnum.enumValues)[number];

