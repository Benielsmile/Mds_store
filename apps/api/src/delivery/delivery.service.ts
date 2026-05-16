import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DB_CONNECTION } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DeliveryService {
  private supabaseAdmin: SupabaseClient;

  constructor(
    @Inject(DB_CONNECTION) private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseServiceKey) {
      this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    }
  }

  async getSignedUrl(orderId: string, userId: string) {
    // 1. Verify the order belongs to the user and is completed
    const [order] = await this.db
      .select()
      .from(schema.orders)
      .where(and(eq(schema.orders.id, orderId), eq(schema.orders.userId, userId)));

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'completed') {
      throw new UnauthorizedException('Order is not completed');
    }

    // 2. Get the product fileUrl
    const [product] = await this.db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, order.productId));

    if (!product || !product.fileUrl) {
      throw new NotFoundException('Product file not found');
    }

    // 3. Generate a signed URL for the product file
    if (!this.supabaseAdmin) {
      throw new Error('Supabase Admin Client not initialized (check ENV variables)');
    }

    // The bucket is assumed to be named 'digital-products'
    const { data, error } = await this.supabaseAdmin.storage
      .from('digital-products')
      .createSignedUrl(product.fileUrl, 3600); // 1 hour expiration

    if (error || !data) {
      throw new Error('Failed to generate signed URL: ' + error?.message);
    }

    return { signedUrl: data.signedUrl };
  }
}
