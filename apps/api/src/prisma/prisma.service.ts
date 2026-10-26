import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({ adapter });
  }

  async onModuleInit() {
    this.logger.log('Connecting to PostgreSQL...');

    try {
      await this.$connect();
      await this.$queryRaw`SELECT 1`;

      this.logger.log('PostgreSQL connection established');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`PostgreSQL connection failed: ${message}`);
      throw error;
    }
  }
}
