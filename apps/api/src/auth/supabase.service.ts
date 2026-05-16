import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private adminClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !serviceRoleKey) {
      console.error('CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from environment variables!');
    }

    this.adminClient = createClient(
      url || 'https://placeholder.supabase.co',
      serviceRoleKey || 'placeholder',
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
  }

  async verifyToken(token: string) {
    const { data: { user }, error } = await this.adminClient.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return { sub: user.id, email: user.email, role: user.role || 'customer' };
  }
}
