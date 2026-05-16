import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

async function setup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is missing');
    process.exit(1);
  }

  const url = connectionString.replace(/\s/g, '%20');
  const sql = postgres(url, { ssl: 'require' });

  try {
    console.log('Seeding site_settings defaults...');

    await sql`
      INSERT INTO site_settings (key, value)
      VALUES ('hero', ${sql.json({
        headline: 'The Best Digital Products for Creators',
        subheadline: 'Discover premium templates, tools, and assets \u2014 built to accelerate your work. Instant digital delivery, one-time purchase.',
        ctaText: 'Shop Now',
        badgeText: 'Premium Digital Products',
      })})
      ON CONFLICT (key) DO NOTHING;
    `;

    await sql`
      INSERT INTO site_settings (key, value)
      VALUES ('store', ${sql.json({
        storeName: 'MDS Store',
        storeDescription: 'Premium digital products for creators and professionals.',
        contactEmail: '',
        twitterHandle: '',
        githubUrl: '',
        currency: 'USD',
      })})
      ON CONFLICT (key) DO NOTHING;
    `;

    console.log('Default site settings seeded.');
    console.log('Setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error during setup:', err);
    process.exit(1);
  }
}

setup();
