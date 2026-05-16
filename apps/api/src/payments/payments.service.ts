import { Injectable, Inject, Logger } from '@nestjs/common';
import { DB_CONNECTION } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { PayPalService } from '../orders/paypal.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject(DB_CONNECTION) private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly paypalService: PayPalService,
  ) {}

  async handleWebhook(webhookData: any, headers: Record<string, string> = {}) {
    this.logger.log('Webhook received: ' + JSON.stringify(webhookData, null, 2));
    await this.paypalService.verifyWebhookSignature(headers, webhookData);
    const eventType = webhookData?.event_type;

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const paypalOrderId = webhookData?.resource?.supplementary_data?.related_ids?.order_id;
      if (!paypalOrderId) return { status: 'ignored' };

      const [order] = await this.db
        .select()
        .from(schema.orders)
        .where(eq(schema.orders.paypalOrderId, paypalOrderId));

      if (order && order.status !== 'completed') {
        await this.db
          .update(schema.orders)
          .set({ status: 'completed' })
          .where(eq(schema.orders.id, order.id));
        return { status: 'completed' };
      }

      return { status: 'already_completed' };
    }

    if (eventType === 'PAYMENT.CAPTURE.DENIED') {
      const paypalOrderId = webhookData?.resource?.supplementary_data?.related_ids?.order_id;
      if (!paypalOrderId) return { status: 'ignored' };

      await this.db
        .update(schema.orders)
        .set({ status: 'failed' })
        .where(eq(schema.orders.paypalOrderId, paypalOrderId));

      return { status: 'failed' };
    }

    return { status: 'received' };
  }
}
