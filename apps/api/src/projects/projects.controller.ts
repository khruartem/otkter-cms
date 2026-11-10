import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

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
  async getProjects(): Promise<ProjectResponseDto[]> {
    const projects = await this.projectsService.getProjects();

    return projects.map((project) => this.projectResponseMapper.toDto(project));
  }

  @Get(':id')
  async getProject(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectsService.getProject(id);

    return this.projectResponseMapper.toDto(project);
  }

  @Post()
  async createProject(
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectsService.createProject(dto);

    return this.projectResponseMapper.toDto(project);
  }

  @Patch(':id')
  async updateProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const project = await this.projectsService.updateProject(id, dto);

    return this.projectResponseMapper.toDto(project);
  }
}
