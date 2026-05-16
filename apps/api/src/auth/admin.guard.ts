import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.email) {
      throw new ForbiddenException('Access denied: no user information');
    }

    const adminEmails = (this.configService.get<string>('ADMIN_EMAILS') || '').split(',').map(e => e.trim().toLowerCase());

    if (!adminEmails.includes(user.email.toLowerCase())) {
      throw new ForbiddenException('Access denied: not an admin user');
    }

    return true;
  }
}
