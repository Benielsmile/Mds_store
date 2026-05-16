import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('delivery')
@UseGuards(SupabaseAuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':orderId')
  async getDeliveryUrl(@Param('orderId') orderId: string, @Request() req: any) {
    const userId = req.user.sub;
    return this.deliveryService.getSignedUrl(orderId, userId);
  }
}
