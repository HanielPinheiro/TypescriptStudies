import { Router } from 'express';
import { listPublicMenu } from '../infrastructure/catalogRepository.js';
export const catalogRoutes = Router();
catalogRoutes.get('/menu', async (_req, res) => {
    const result = await listPublicMenu();
    res.json(result);
});
