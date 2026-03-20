import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { catalogRoutes } from './modules/catalog/presentation/catalog.routes.js';
import { customersRoutes } from './modules/customers/presentation/customers.routes.js';
import { ordersRoutes } from './modules/orders/presentation/orders.routes.js';
import { AppError } from './shared/appError.js';
export const app = express();
app.use(express.json());
app.use(cors({
    origin: env.WEB_ORIGIN,
}));
app.get('/health', (_req, res) => {
    res.json({ ok: true });
});
app.use('/api/catalog', catalogRoutes);
app.use('/api', customersRoutes);
app.use('/api/orders', ordersRoutes);
app.use((err, _req, res, next) => {
    void next;
    if (err instanceof ZodError) {
        res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Dados inválidos', issues: err.issues });
        return;
    }
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ code: err.code, message: err.message });
        return;
    }
    res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Erro interno' });
});
