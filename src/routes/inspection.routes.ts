import { Router } from 'express';

import { inspectionAttachmentsUpload } from '../config/upload';
import { authMiddleware } from '../middlewares/auth-middleware';
import { attachmentController } from '../modules/attachments/attachment.controller';
import { inspectionController } from '../modules/inspections/inspection.controller';
import { asyncHandler } from '../utils/async-handler';

export const inspectionRouter = Router();

inspectionRouter.use(authMiddleware);
inspectionRouter.get('/', asyncHandler(inspectionController.list));
inspectionRouter.get('/:id', asyncHandler(inspectionController.show));
inspectionRouter.post('/', asyncHandler(inspectionController.create));
inspectionRouter.put('/:id', asyncHandler(inspectionController.update));
inspectionRouter.get('/:id/attachments', asyncHandler(attachmentController.listByInspection));
inspectionRouter.post(
  '/:id/attachments',
  inspectionAttachmentsUpload.array('files'),
  asyncHandler(attachmentController.upload),
);

