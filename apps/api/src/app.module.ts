import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { EventsModule } from './events/events.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { StorageModule } from './storage/storage.module.js';
import { ImagesModule } from './images/images.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { PersonsService } from './persons/persons.service.js';
import { PersonsController } from './persons/persons.controller.js';
import { PersonsModule } from './persons/persons.module.js';

@Module({
  imports: [
    EventsModule,
    PrismaModule,
    ProjectsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    StorageModule,
    ImagesModule,
    CategoriesModule,
    PersonsModule,
  ],
  controllers: [AppController, PersonsController],
  providers: [AppService, PersonsService],
})
export class AppModule {}
