import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EventsModule } from './events/events.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [EventsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
