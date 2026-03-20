import { randomUUID } from 'node:crypto';
import { db } from '../../../config/db.js';
function mapCustomer(row) {
    return { id: row.id, name: row.name, email: row.email, passwordHash: row.password_hash };
}
export async function findCustomerByEmail(input) {
    const k = db();
    const row = await k('customers').select('*').where({ email: input.email }).first();
    return row ? mapCustomer(row) : null;
}
export async function findCustomerById(input) {
    const k = db();
    const row = await k('customers').select('*').where({ id: input.id }).first();
    return row ? mapCustomer(row) : null;
}
export async function createCustomer(input) {
    const k = db();
    const customer = { id: randomUUID(), name: input.name, email: input.email, passwordHash: input.passwordHash };
    await k('customers').insert({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password_hash: customer.passwordHash,
    });
    return customer;
}
