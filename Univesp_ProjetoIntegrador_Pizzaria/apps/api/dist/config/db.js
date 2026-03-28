import knex from 'knex';
import { env } from './env.js';
let dbInstance = null;
export function db() {
    if (dbInstance)
        return dbInstance;
    dbInstance =
        env.DB_CLIENT === 'sqlite3'
            ? knex({
                client: 'sqlite3',
                connection: { filename: env.DB_FILENAME },
                useNullAsDefault: true,
            })
            : knex({
                client: env.DB_CLIENT,
                connection: env.DATABASE_URL
                    ? env.DB_CLIENT === 'pg'
                        ? { connectionString: env.DATABASE_URL, ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined }
                        : env.DATABASE_URL
                    : {
                        host: env.DB_HOST,
                        port: env.DB_PORT,
                        user: env.DB_USER,
                        password: env.DB_PASSWORD,
                        database: env.DB_NAME,
                    },
                pool: { min: 0, max: 10 },
            });
    return dbInstance;
}
export async function ensureSchema() {
    const k = db();
    const hasCategories = await k.schema.hasTable('categories');
    if (!hasCategories) {
        await k.schema.createTable('categories', (t) => {
            t.uuid('id').primary();
            t.string('name').notNullable();
            t.string('slug').notNullable().unique();
            t.timestamps(true, true);
        });
    }
    const hasProducts = await k.schema.hasTable('products');
    if (!hasProducts) {
        await k.schema.createTable('products', (t) => {
            t.uuid('id').primary();
            t.uuid('category_id').references('id').inTable('categories').onDelete('SET NULL');
            t.string('name').notNullable();
            t.text('description').notNullable().defaultTo('');
            t.integer('price_cents').notNullable();
            t.string('image_url').notNullable().defaultTo('');
            t.boolean('active').notNullable().defaultTo(true);
            t.timestamps(true, true);
        });
    }
    const hasCustomers = await k.schema.hasTable('customers');
    if (!hasCustomers) {
        await k.schema.createTable('customers', (t) => {
            t.uuid('id').primary();
            t.string('name').notNullable();
            t.string('email').notNullable().unique();
            t.string('password_hash').notNullable();
            t.string('cep').notNullable().defaultTo('');
            t.string('street').notNullable().defaultTo('');
            t.string('number').notNullable().defaultTo('');
            t.string('complement').notNullable().defaultTo('');
            t.string('neighborhood').notNullable().defaultTo('');
            t.string('city').notNullable().defaultTo('');
            t.string('state').notNullable().defaultTo('');
            t.timestamps(true, true);
        });
    }
    else {
        const hasCep = await k.schema.hasColumn('customers', 'cep');
        if (!hasCep)
            await k.schema.alterTable('customers', (t) => t.string('cep').notNullable().defaultTo(''));
        const hasStreet = await k.schema.hasColumn('customers', 'street');
        if (!hasStreet)
            await k.schema.alterTable('customers', (t) => t.string('street').notNullable().defaultTo(''));
        const hasNumber = await k.schema.hasColumn('customers', 'number');
        if (!hasNumber)
            await k.schema.alterTable('customers', (t) => t.string('number').notNullable().defaultTo(''));
        const hasComplement = await k.schema.hasColumn('customers', 'complement');
        if (!hasComplement)
            await k.schema.alterTable('customers', (t) => t.string('complement').notNullable().defaultTo(''));
        const hasNeighborhood = await k.schema.hasColumn('customers', 'neighborhood');
        if (!hasNeighborhood)
            await k.schema.alterTable('customers', (t) => t.string('neighborhood').notNullable().defaultTo(''));
        const hasCity = await k.schema.hasColumn('customers', 'city');
        if (!hasCity)
            await k.schema.alterTable('customers', (t) => t.string('city').notNullable().defaultTo(''));
        const hasState = await k.schema.hasColumn('customers', 'state');
        if (!hasState)
            await k.schema.alterTable('customers', (t) => t.string('state').notNullable().defaultTo(''));
    }
    const hasOrders = await k.schema.hasTable('orders');
    if (!hasOrders) {
        await k.schema.createTable('orders', (t) => {
            t.uuid('id').primary();
            t.uuid('customer_id').references('id').inTable('customers').onDelete('SET NULL');
            t.string('status').notNullable();
            t.integer('total_cents').notNullable();
            t.string('delivery_address').notNullable().defaultTo('');
            t.timestamps(true, true);
        });
    }
    const hasOrderItems = await k.schema.hasTable('order_items');
    if (!hasOrderItems) {
        await k.schema.createTable('order_items', (t) => {
            t.uuid('id').primary();
            t.uuid('order_id').references('id').inTable('orders').onDelete('CASCADE');
            t.uuid('product_id').references('id').inTable('products').onDelete('RESTRICT');
            t.string('product_name').notNullable();
            t.integer('quantity').notNullable();
            t.integer('unit_price_cents').notNullable();
            t.text('notes').notNullable().defaultTo('');
            t.timestamps(true, true);
        });
    }
}
