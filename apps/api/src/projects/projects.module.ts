import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller.js';
import { ProjectsService } from './projects.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [PrismaModule],
})
export class ProjectsModule {}
