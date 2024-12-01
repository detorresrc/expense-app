import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const postgresClient = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client: postgresClient });