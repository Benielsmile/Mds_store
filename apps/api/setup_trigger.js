import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

async function setupTrigger() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  const url = connectionString.replace(/\s/g, '%20');
  const sql = postgres(url, { ssl: 'require' });

  try {
    console.log('Creating auth trigger...');

    await sql`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.users (id, email, name, role)
        VALUES (
          new.id,
          new.email,
          COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
          'customer'
        )
        ON CONFLICT (id) DO NOTHING;
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    await sql`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`;

    await sql`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;

    console.log('Auth trigger created.');

    console.log('Syncing existing users...');
    await sql`
      INSERT INTO public.users (id, email, name, role)
      SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', ''), 'customer'
      FROM auth.users
      ON CONFLICT (id) DO NOTHING;
    `;

    console.log('Existing users synced.');
    process.exit(0);
  } catch (err) {
    console.error('Error during setup:', err);
    process.exit(1);
  }
}

setupTrigger();
