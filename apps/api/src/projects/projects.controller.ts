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
import { ProjectResponseMapper } from './mappers/project-response.mapper.js';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectResponseDto } from './dto/project-response.dto.js';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectResponseMapper: ProjectResponseMapper,
  ) {}

  @Get()
  getProjects(): Promise<Project[]> {
    return this.projectsService.getProjects();
  }

  @Get(':id')
  async getProject(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectsService.getProject(id);

    return this.projectResponseMapper.toDto(project);
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
