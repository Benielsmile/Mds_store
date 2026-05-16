import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

export const DB_CONNECTION = 'DB_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        if (!connectionString) {
          throw new Error('DATABASE_URL is not set');
        }
        const encodedUrl = connectionString.replace(/\s/g, '%20');
        const client = postgres(encodedUrl);
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DB_CONNECTION],
})
export class DbModule {}
