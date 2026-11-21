import { Module } from '@nestjs/common';

import { ImagesModule } from '../images/images.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { EventsModule } from '../events/events.module.js';

import { ProjectsController } from './projects.controller.js';

import { ProjectsService } from './projects.service.js';
import { ProjectResponseMapper } from './mappers/project-response.mapper.js';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectResponseMapper],
  imports: [PrismaModule, ImagesModule, CategoriesModule, EventsModule],
})
export class ProjectsModule {}
