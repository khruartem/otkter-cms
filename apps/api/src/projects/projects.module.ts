import { Module } from '@nestjs/common';

import { ImagesModule } from '../images/images.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

import { ProjectsController } from './projects.controller.js';

import { ProjectsService } from './projects.service.js';
import { ProjectResponseMapper } from './mappers/project-response.mapper.js';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectResponseMapper],
  imports: [PrismaModule, ImagesModule],
})
export class ProjectsModule {}
