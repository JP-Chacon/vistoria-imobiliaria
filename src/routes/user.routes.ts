import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth-middleware';
import { userController } from '../modules/users/user.controller';
import { asyncHandler } from '../utils/async-handler';

export const userRouter = Router();

userRouter.get('/me', authMiddleware, asyncHandler(userController.getCurrentUser));

