import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { ProjectsService } from './projects.service.js';
import { ProjectResponseMapper } from './mappers/project-response.mapper.js';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ResponseProjectDto } from './dto/response-project.dto.js';
import { AddProjectCategoryDto } from './dto/add-project-category.dto.js';
import { AddProjectPersonDto } from './dto/add-project-person.dto.js';

import type {
  ProjectCategory,
  ProjectPerson,
} from '../generated/prisma/client.js';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectResponseMapper: ProjectResponseMapper,
  ) {}

  @Get()
  async getProjects(): Promise<ResponseProjectDto[]> {
    const projects = await this.projectsService.findAll();

    return projects.map((project) => this.projectResponseMapper.toDto(project));
  }

  @Get(':id')
  async getProject(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseProjectDto> {
    const project = await this.projectsService.findOne(id);

    return this.projectResponseMapper.toDto(project);
  }

  @Post()
  async createProject(
    @Body() dto: CreateProjectDto,
  ): Promise<ResponseProjectDto> {
    const project = await this.projectsService.create(dto);

    return this.projectResponseMapper.toDto(project);
  }

  @Patch(':id')
  async updateProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ResponseProjectDto> {
    const project = await this.projectsService.update(id, dto);

    return this.projectResponseMapper.toDto(project);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.projectsService.remove(id);
  }

  @Post(':id/categories')
  async addProjectCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddProjectCategoryDto,
  ): Promise<ProjectCategory> {
    return this.projectsService.assignCategory(id, dto);
  }

  @Delete(':id/categories/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProjectCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<void> {
    await this.projectsService.unassignCategory(id, categoryId);
  }

  @Post(':id/persons')
  async addProjectPerson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddProjectPersonDto,
  ): Promise<ProjectPerson> {
    return this.projectsService.assignPerson(id, dto);
  }
}
