import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth-middleware';
import { propertyController } from '../modules/properties/property.controller';
import { asyncHandler } from '../utils/async-handler';

export const propertyRouter = Router();

propertyRouter.use(authMiddleware);
propertyRouter.get('/', asyncHandler(propertyController.list));
propertyRouter.get('/:id', asyncHandler(propertyController.show));
propertyRouter.post('/', asyncHandler(propertyController.create));
propertyRouter.put('/:id', asyncHandler(propertyController.update));
propertyRouter.delete('/:id', asyncHandler(propertyController.remove));

