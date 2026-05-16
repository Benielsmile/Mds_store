import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() webhookData: any,
    @Headers() headers: Record<string, string>,
  ) {
    await this.paymentsService.handleWebhook(webhookData, headers);
    return { received: true };
  }
}
