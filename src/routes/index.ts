import { Router } from 'express';

import { attachmentRouter } from './attachment.routes';
import { authRouter } from './auth.routes';
import { healthRouter } from './health.routes';
import { inspectionRouter } from './inspection.routes';
import { propertyRouter } from './property.routes';
import { userRouter } from './user.routes';

const routes = Router();

routes.use('/health', healthRouter);
routes.use('/auth', authRouter);
routes.use('/users', userRouter);
routes.use('/properties', propertyRouter);
routes.use('/inspections', inspectionRouter);
routes.use('/attachments', attachmentRouter);

export { routes };

