import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../../shared/appError.js';
import { requireAuth } from '../../../shared/requireAuth.js';
import { findProductById } from '../../catalog/infrastructure/catalogRepository.js';
import { createOrder, listOrdersByCustomer } from '../infrastructure/ordersRepository.js';
export const ordersRoutes = Router();
ordersRoutes.post('/', requireAuth, async (req, res) => {
    const auth = req.auth;
    const body = z
        .object({
        deliveryAddress: z.string().min(10),
        items: z
            .array(z.object({
            productId: z.string().uuid(),
            quantity: z.number().int().positive().max(99),
            notes: z.string().max(200).optional(),
        }))
            .min(1),
    })
        .parse(req.body);
    let totalCents = 0;
    const resolvedItems = [];
    for (const item of body.items) {
        const product = await findProductById({ id: item.productId });
        if (!product || !product.active) {
            throw new AppError({ statusCode: 400, code: 'INVALID_PRODUCT', message: 'Produto inválido' });
        }
        totalCents += product.priceCents * item.quantity;
        resolvedItems.push({
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            unitPriceCents: product.priceCents,
            notes: item.notes?.trim() ?? '',
        });
    }
    const created = await createOrder({
        customerId: auth.customerId,
        deliveryAddress: body.deliveryAddress.trim(),
        status: 'created',
        totalCents,
        items: resolvedItems,
    });
    res.status(201).json({ id: created.orderId });
});
ordersRoutes.get('/mine', requireAuth, async (req, res) => {
    const auth = req.auth;
    const orders = await listOrdersByCustomer({ customerId: auth.customerId });
    res.json({ orders });
});
