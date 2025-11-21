import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth-middleware';
import { attachmentController } from '../modules/attachments/attachment.controller';
import { asyncHandler } from '../utils/async-handler';

export const attachmentRouter = Router();

attachmentRouter.use(authMiddleware);
attachmentRouter.delete('/:id', asyncHandler(attachmentController.remove));

