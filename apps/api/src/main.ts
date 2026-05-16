import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix — all routes become /api/...
  app.setGlobalPrefix('api');

  // Allow requests from the Next.js frontend (dev servers, production, or tunnel URLs)
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      const allowed: string[] = [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL,
      ].filter((s): s is string => !!s);
      if (allowed.some(a => origin.startsWith(a))) return callback(null, true);
      // Allow tunnel URLs in dev
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      callback(null, false);
    },
    credentials: true,
  });

  // Auto-validate request DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 API running at http://localhost:${port}/api`);
}
bootstrap();
