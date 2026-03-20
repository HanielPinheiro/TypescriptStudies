import 'dotenv/config';
import { z } from 'zod';
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3333),
    WEB_ORIGIN: z.string().default('http://localhost:5173'),
    DB_CLIENT: z.enum(['sqlite3', 'pg', 'mysql2']).default('sqlite3'),
    DATABASE_URL: z.string().optional(),
    DB_SSL: z.coerce.boolean().default(false),
    DB_FILENAME: z.string().default('./dev.sqlite3'),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.coerce.number().int().positive().default(5432),
    DB_USER: z.string().default('postgres'),
    DB_PASSWORD: z.string().default('postgres'),
    DB_NAME: z.string().default('pizzaria'),
    JWT_SECRET: z.string().min(16).default('dev_only_change_me_please'),
});
export const env = envSchema.parse(process.env);
