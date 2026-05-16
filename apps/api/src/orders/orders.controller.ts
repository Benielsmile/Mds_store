import { Controller, Post, Body, Get, Param, Request, UseGuards, Inject } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { DB_CONNECTION } from '../db/db.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateOrderDto } from './dto/create-order.dto';
import { CaptureOrderDto } from './dto/capture-order.dto';

@Controller('orders')
@UseGuards(SupabaseAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(DB_CONNECTION) private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  @Get()
  findAll(@Request() req: any) {
    return this.db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.userId, req.user.sub))
      .orderBy(desc(schema.orders.createdAt));
  }

  @Post('checkout')
  createCheckout(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.ordersService.createCheckout(createOrderDto, userId);
  }

  @Post('capture')
  capturePayment(@Body() body: CaptureOrderDto, @Request() req: any) {
    const userId = req.user.sub;
    return this.ordersService.capturePayment(userId, body.paypalOrderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
