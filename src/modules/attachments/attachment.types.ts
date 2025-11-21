import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import { attachments } from '../../database/schema';

export type Attachment = InferSelectModel<typeof attachments>;
export type CreateAttachmentDTO = Omit<
  InferInsertModel<typeof attachments>,
  'id' | 'createdAt' | 'updatedAt'
>;

