import express, {Request, Response} from 'express';
import {MessageResponse} from '../types/Messages';
import categoryRouter from './routes/categoryRoute';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req: Request, res: Response) => {
  res.json({
    message: 'api v1',
  });
});

router.use('/categories', categoryRouter);

export default router;
