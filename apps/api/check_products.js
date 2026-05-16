import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

async function checkProducts() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  const url = connectionString.replace('Mds e-commerce01', 'Mds%20e-commerce01');
  const sql = postgres(url, { ssl: 'require' });

  try {
    const products = await sql`SELECT * FROM products`;
    console.log('Products in DB:', products.length);
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkProducts();
