import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PayPalService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET') || '';
    this.baseUrl = 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayPal auth failed: ${err}`);
    }
    const data: any = await res.json();
    return data.access_token;
  }

  async createOrder(amount: string, description: string): Promise<{ id: string; approvalUrl: string }> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'USD', value: amount },
            description: description.substring(0, 127),
          },
        ],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayPal create order failed: ${err}`);
    }
    const data: any = await res.json();
    const approvalUrl = data.links?.find((l: any) => l.rel === 'approve')?.href || '';
    return { id: data.id, approvalUrl };
  }

  async captureOrder(paypalOrderId: string): Promise<any> {
    const token = await this.getAccessToken();
    const res = await fetch(`${this.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PayPal capture failed: ${err}`);
    }
    return res.json();
  }

  async verifyWebhookSignature(
    headers: Record<string, string>,
    body: any,
  ): Promise<boolean> {
    const webhookId = this.configService.get<string>('PAYPAL_WEBHOOK_ID');
    if (!webhookId) {
      console.warn('PAYPAL_WEBHOOK_ID not set — skipping webhook verification');
      return true;
    }

    const token = await this.getAccessToken();
    const verificationRequest = {
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: body,
    };

    const res = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationRequest),
    });

    if (!res.ok) {
      throw new UnauthorizedException('PayPal webhook verification failed');
    }

    const result: any = await res.json();
    if (result.verification_status !== 'SUCCESS') {
      throw new UnauthorizedException('PayPal webhook signature invalid');
    }

    return true;
  }
}
