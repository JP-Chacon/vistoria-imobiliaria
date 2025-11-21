import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { inspectionStatusEnum, inspections } from '../../database/schema';

export type InspectionStatus = (typeof inspectionStatusEnum.enumValues)[number];

export type Inspection = InferSelectModel<typeof inspections>;

export type CreateInspectionDTO = Omit<
  InferInsertModel<typeof inspections>,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export type UpdateInspectionDTO = Partial<Pick<
  InferInsertModel<typeof inspections>,
  'status' | 'inspectorName' | 'scheduledFor' | 'notes'
>>;