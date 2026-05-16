import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

async function setupBuckets() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Checking and creating storage buckets...');

    // Create public bucket for images
    const { data: imgData, error: imgError } = await supabase.storage.createBucket('product-images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
      fileSizeLimit: 5242880, // 5MB
    });
    
    if (imgError) {
      if (imgError.message.includes('already exists') || imgError.message.includes('Duplicate')) {
        console.log('Bucket "product-images" already exists.');
      } else {
        console.error('Failed to create product-images bucket:', imgError.message);
      }
    } else {
      console.log('Created bucket: product-images (Public)');
    }

    // Create private bucket for digital products
    const { data: prodData, error: prodError } = await supabase.storage.createBucket('digital-products', {
      public: false,
      fileSizeLimit: 52428800, // 50MB to fit within standard free tier
    });

    if (prodError) {
      if (prodError.message.includes('already exists') || prodError.message.includes('Duplicate')) {
        console.log('Bucket "digital-products" already exists.');
      } else {
        console.error('Failed to create digital-products bucket:', prodError.message);
      }
    } else {
      console.log('Created bucket: digital-products (Private)');
    }

    console.log('Bucket setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error during bucket setup:', err);
    process.exit(1);
  }
}

setupBuckets();
