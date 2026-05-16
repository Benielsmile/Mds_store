import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { AdminGuard } from './admin.guard';

@Module({
  providers: [SupabaseService, SupabaseAuthGuard, AdminGuard],
  controllers: [AuthController],
  exports: [SupabaseAuthGuard, SupabaseService, AdminGuard],
})
export class AuthModule {}
