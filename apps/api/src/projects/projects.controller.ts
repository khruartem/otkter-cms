import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import type { Project } from '../generated/prisma/client.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }

  @Get(':id')
  async getProject(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {
    const project = await this.projectsService.getProject(id);

    if (!project) {
      throw new NotFoundException('Проект не найден!');
    }

    return project;
  }
}
