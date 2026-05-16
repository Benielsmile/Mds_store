import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { DB_CONNECTION } from '../db/db.module';
import { orders, products } from '../db/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { PayPalService } from './paypal.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DB_CONNECTION) private readonly db: PostgresJsDatabase<typeof schema>,
    private readonly paypalService: PayPalService,
  ) {}

  async createCheckout(createOrderDto: CreateOrderDto, userId: string) {
    const items = createOrderDto.items;
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('items array is required');
    }

    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await this.db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    if (dbProducts.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const totalAmount = dbProducts
      .reduce((sum, p) => sum + parseFloat(p.price), 0)
      .toFixed(2);

    const title = dbProducts.length === 1
      ? dbProducts[0].title
      : `MDS Store (${dbProducts.length} items)`;

    const paypalOrder = await this.paypalService.createOrder(totalAmount, title);

    for (const product of dbProducts) {
      await this.db.insert(orders).values({
        userId,
        productId: product.id,
        amount: product.price,
        status: 'pending',
        paypalOrderId: paypalOrder.id,
      });
    }

    return { paypalOrderId: paypalOrder.id, total: totalAmount };
  }

  async capturePayment(userId: string, paypalOrderId: string) {
    const userOrders = await this.db
      .select()
      .from(orders)
      .where(eq(orders.paypalOrderId, paypalOrderId));

    if (userOrders.length === 0) {
      throw new NotFoundException('Order not found');
    }

    if (userOrders.some(o => o.userId !== userId)) {
      throw new BadRequestException('Order does not belong to user');
    }

    if (userOrders.some(o => o.status !== 'pending')) {
      throw new BadRequestException('One or more orders are not pending');
    }

    await this.paypalService.captureOrder(paypalOrderId);

    await this.db
      .update(orders)
      .set({ status: 'completed' })
      .where(eq(orders.paypalOrderId, paypalOrderId));

    return { success: true };
  }

  async findOne(id: string) {
    const [order] = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id));

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
