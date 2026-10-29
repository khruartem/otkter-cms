import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { type Project } from '../generated/prisma/client.js';

import { ProjectsService } from './projects.service.js';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }

  @Get(':id')
  getProject(@Param('id', ParseUUIDPipe) id: string): Promise<Project> {
    return this.projectsService.getProject(id);
  }

  @Post()
  createProject(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(dto);
  }

  @Patch(':id')
  updateProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.updateProject(id, dto);
  }
}
