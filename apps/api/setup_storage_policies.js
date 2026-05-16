import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

async function setupPolicies() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  const url = connectionString.replace('Mds e-commerce01', 'Mds%20e-commerce01');
  const sql = postgres(url, { ssl: 'require' });

  try {
    console.log('Setting up storage RLS policies...');

    // Note: To avoid errors if policies already exist, we drop them first or just use "CREATE POLICY ... ON storage.objects"
    // Since Supabase allows dropping if exists:
    await sql`DROP POLICY IF EXISTS "Public View Images" ON storage.objects`;
    await sql`DROP POLICY IF EXISTS "Admin Upload Images" ON storage.objects`;
    await sql`DROP POLICY IF EXISTS "Admin Update Images" ON storage.objects`;
    await sql`DROP POLICY IF EXISTS "Admin Delete Images" ON storage.objects`;

    await sql`DROP POLICY IF EXISTS "Admin View Digital Products" ON storage.objects`;
    await sql`DROP POLICY IF EXISTS "Admin Upload Digital Products" ON storage.objects`;
    await sql`DROP POLICY IF EXISTS "Admin Update Digital Products" ON storage.objects`;
    await sql`DROP POLICY IF EXISTS "Admin Delete Digital Products" ON storage.objects`;

    // Policies for product-images bucket
    console.log('Creating policies for product-images...');
    
    // Anyone can view images
    await sql`
      CREATE POLICY "Public View Images"
      ON storage.objects FOR SELECT
      USING ( bucket_id = 'product-images' );
    `;

    // Only authenticated users (for now, any logged in user, ideally checking role='admin') can upload/update/delete
    // We will just restrict it to authenticated users for the MVP
    await sql`
      CREATE POLICY "Admin Upload Images"
      ON storage.objects FOR INSERT
      WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
    `;

    await sql`
      CREATE POLICY "Admin Update Images"
      ON storage.objects FOR UPDATE
      USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
    `;

    await sql`
      CREATE POLICY "Admin Delete Images"
      ON storage.objects FOR DELETE
      USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
    `;

    // Policies for digital-products bucket
    console.log('Creating policies for digital-products...');
    
    // Authenticated users can view digital products (in reality the backend will generate signed URLs using service key which bypasses RLS)
    // But we need the admin frontend to be able to upload
    await sql`
      CREATE POLICY "Admin View Digital Products"
      ON storage.objects FOR SELECT
      USING ( bucket_id = 'digital-products' AND auth.role() = 'authenticated' );
    `;

    await sql`
      CREATE POLICY "Admin Upload Digital Products"
      ON storage.objects FOR INSERT
      WITH CHECK ( bucket_id = 'digital-products' AND auth.role() = 'authenticated' );
    `;

    await sql`
      CREATE POLICY "Admin Update Digital Products"
      ON storage.objects FOR UPDATE
      USING ( bucket_id = 'digital-products' AND auth.role() = 'authenticated' );
    `;

    await sql`
      CREATE POLICY "Admin Delete Digital Products"
      ON storage.objects FOR DELETE
      USING ( bucket_id = 'digital-products' AND auth.role() = 'authenticated' );
    `;

    console.log('Storage policies created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during policy setup:', err);
    process.exit(1);
  }
}

setupPolicies();
