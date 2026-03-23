import { randomUUID } from 'node:crypto';
import { db } from '../../../config/db.js';
function mapCategory(row) {
    return { id: row.id, name: row.name, slug: row.slug };
}
function mapProduct(row) {
    return {
        id: row.id,
        categoryId: row.category_id,
        name: row.name,
        description: row.description,
        priceCents: row.price_cents,
        imageUrl: row.image_url,
        active: row.active,
    };
}
export async function listPublicMenu() {
    const k = db();
    const [categories, products] = await Promise.all([
        k('categories').select('*').orderBy('name', 'asc'),
        k('products').select('*').where({ active: true }).orderBy('name', 'asc'),
    ]);
    return { categories: categories.map(mapCategory), products: products.map(mapProduct) };
}
export async function findProductById(input) {
    const k = db();
    const row = await k('products').select('*').where({ id: input.id }).first();
    return row ? mapProduct(row) : null;
}
export async function findProductsByIds(input) {
    const ids = input.ids.map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0)
        return [];
    const k = db();
    const rows = await k('products').select('*').whereIn('id', ids);
    return rows.map(mapProduct);
}
export async function seedCatalogIfEmpty() {
    const k = db();
    const [{ count }] = await k('products').count({ count: '*' });
    const total = typeof count === 'string' ? Number(count) : (count ?? 0);
    if (total > 0)
        return;
    const categories = [
        { id: randomUUID(), name: 'Pizzas', slug: 'pizzas' },
        { id: randomUUID(), name: 'Bebidas', slug: 'bebidas' },
        { id: randomUUID(), name: 'Sobremesas', slug: 'sobremesas' },
    ];
    const bySlug = new Map(categories.map((c) => [c.slug, c.id]));
    const products = [
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Pizza (8 pedaços) — Monte a sua',
            description: 'Escolha 1, 2 ou 3 sabores e opção de borda recheada.',
            price_cents: 0,
            image_url: '/images/pizzas/montar-sua.jpeg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Margherita',
            description: 'Molho de tomate, muçarela, manjericão e azeite.',
            price_cents: 4490,
            image_url: '/images/pizzas/margherita.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Calabresa',
            description: 'Calabresa fatiada, cebola, muçarela e orégano.',
            price_cents: 4790,
            image_url: '/images/pizzas/calabresa.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Pepperoni',
            description: 'Muçarela, pepperoni e toque de pimenta.',
            price_cents: 4990,
            image_url: '/images/pizzas/pepperoni.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Quatro Queijos',
            description: 'Muçarela, parmesão, provolone e gorgonzola.',
            price_cents: 5390,
            image_url: '/images/pizzas/quatro-queijos.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Portuguesa',
            description: 'Presunto, ovos, cebola, azeitona, muçarela e orégano.',
            price_cents: 5490,
            image_url: '/images/pizzas/portuguesa.jpeg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Frango com Catupiry',
            description: 'Frango desfiado, catupiry e orégano.',
            price_cents: 5590,
            image_url: '/images/pizzas/frango-catupiry.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Toscana',
            description: 'Linguiça toscana, muçarela e orégano.',
            price_cents: 5190,
            image_url: '/images/pizzas/toscana.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Bacon',
            description: 'Bacon crocante, muçarela e molho de tomate.',
            price_cents: 5690,
            image_url: '/images/pizzas/bacon.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Vegetariana',
            description: 'Legumes, muçarela e orégano.',
            price_cents: 5190,
            image_url: '/images/pizzas/vegetariana.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('pizzas') ?? null,
            name: 'Napolitana',
            description: 'Muçarela, tomate, parmesão e orégano.',
            price_cents: 4990,
            image_url: '/images/pizzas/napolitana.JPG',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('bebidas') ?? null,
            name: 'Refrigerante (2L)',
            description: 'Coca-cola, guaraná ou similar.',
            price_cents: 1290,
            image_url: '/images/bebidas/refrigerante-2l.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('bebidas') ?? null,
            name: 'Refrigerante (lata)',
            description: '350ml — diversos sabores.',
            price_cents: 590,
            image_url: '/images/bebidas/refrigerante-lata.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('bebidas') ?? null,
            name: 'Água (500ml)',
            description: 'Sem gás ou com gás.',
            price_cents: 390,
            image_url: '/images/bebidas/agua.jpeg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('bebidas') ?? null,
            name: 'Suco (500ml)',
            description: 'Laranja, uva ou limão.',
            price_cents: 790,
            image_url: '/images/bebidas/suco.png',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('sobremesas') ?? null,
            name: 'Brownie',
            description: 'Chocolate intenso e casquinha crocante.',
            price_cents: 1590,
            image_url: '/images/sobremesas/brownie.JPG',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('sobremesas') ?? null,
            name: 'Pudim',
            description: 'Pudim de leite condensado com calda.',
            price_cents: 1490,
            image_url: '/images/sobremesas/pudim.jpg',
            active: true,
        },
        {
            id: randomUUID(),
            category_id: bySlug.get('sobremesas') ?? null,
            name: 'Açaí (pote)',
            description: 'Açaí tradicional.',
            price_cents: 1290,
            image_url: '/images/sobremesas/acai.jpg',
            active: true,
        },
    ];
    await k.transaction(async (trx) => {
        await trx('categories').insert(categories);
        await trx('products').insert(products);
    });
}
