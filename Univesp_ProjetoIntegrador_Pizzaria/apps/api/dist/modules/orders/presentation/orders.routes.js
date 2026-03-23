import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../../shared/appError.js';
import { requireAuth } from '../../../shared/requireAuth.js';
import { findProductById, findProductsByIds } from '../../catalog/infrastructure/catalogRepository.js';
import { createOrder, listOrdersByCustomer } from '../infrastructure/ordersRepository.js';
export const ordersRoutes = Router();
const STUFFED_CRUST_EXTRA_CENTS = 890;
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
            pizza: z
                .object({
                flavorIds: z.array(z.string().uuid()).min(1).max(3),
                stuffedCrust: z.boolean().optional(),
            })
                .optional(),
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
        if (item.pizza) {
            const uniqueFlavorIds = Array.from(new Set(item.pizza.flavorIds));
            if (uniqueFlavorIds.length !== item.pizza.flavorIds.length) {
                throw new AppError({ statusCode: 400, code: 'INVALID_PIZZA', message: 'Sabores duplicados' });
            }
            const flavors = await findProductsByIds({ ids: uniqueFlavorIds });
            if (flavors.length !== uniqueFlavorIds.length || flavors.some((p) => !p.active)) {
                throw new AppError({ statusCode: 400, code: 'INVALID_PIZZA', message: 'Sabores inválidos' });
            }
            const stuffedCrust = item.pizza.stuffedCrust ?? false;
            const maxFlavorPriceCents = Math.max(...flavors.map((f) => f.priceCents));
            const unitPriceCents = maxFlavorPriceCents + (stuffedCrust ? STUFFED_CRUST_EXTRA_CENTS : 0);
            const flavorsLabel = flavors.map((f) => f.name).join(' / ');
            const suffix = stuffedCrust ? ' + borda recheada' : '';
            const productName = `Pizza 8 pedaços (${flavors.length} sabor${flavors.length > 1 ? 'es' : ''}): ${flavorsLabel}${suffix}`;
            const baseNotes = `Sabores: ${flavorsLabel}${stuffedCrust ? ' • Borda recheada' : ''}`;
            const userNotes = item.notes?.trim() ?? '';
            const combinedNotes = userNotes ? `${baseNotes} | ${userNotes}` : baseNotes;
            totalCents += unitPriceCents * item.quantity;
            resolvedItems.push({
                productId: product.id,
                productName,
                quantity: item.quantity,
                unitPriceCents,
                notes: combinedNotes.slice(0, 200),
            });
            continue;
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
