import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { AddProjectCategoryDto } from './dto/add-project-category.dto.js';

import type { ProjectWithImages } from './types.js';
import type { ProjectCategory } from '../generated/prisma/client.js';

import { handlePrismaError } from '../prisma/utils/handle-prisma-error.js';
import { handleProjectError } from './utils/handle-project-error.js';

import { projectImagesInclude } from './config/project-images-include.js';
import { projectCategoryErrorMessages } from './config/project-category-error-messages.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<ProjectWithImages[]> {
    return this.prismaService.project.findMany({
      include: projectImagesInclude,
    });
  }

  async findOne(id: string): Promise<ProjectWithImages> {
    const project = await this.prismaService.project.findUnique({
      where: { id },
      include: projectImagesInclude,
    });

    if (!project) {
      throw new NotFoundException('Проект не найден!');
    }

    return project;
  }

  async create(dto: CreateProjectDto): Promise<ProjectWithImages> {
    try {
      return await this.prismaService.project.create({
        data: {
          ...dto,
        },
        include: projectImagesInclude,
      });
    } catch (error) {
      handleProjectError(error);
    }
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectWithImages> {
    try {
      return await this.prismaService.project.update({
        where: { id },
        data: { ...dto },
        include: projectImagesInclude,
      });
    } catch (error) {
      handleProjectError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.project.delete({
        where: { id },
      });
    } catch (error) {
      handleProjectError(error);
    }
  }

  async assignCategory(
    projectId: string,
    dto: AddProjectCategoryDto,
  ): Promise<ProjectCategory> {
    try {
      return await this.prismaService.projectCategory.create({
        data: {
          projectId,
          ...dto,
        },
      });
    } catch (error) {
      handlePrismaError(error, projectCategoryErrorMessages);
    }
  }

  async unassignCategory(projectId: string, categoryId: string): Promise<void> {
    try {
      await this.prismaService.projectCategory.delete({
        where: {
          projectId_categoryId: {
            projectId,
            categoryId,
          },
        },
      });
    } catch (error) {
      handlePrismaError(error, projectCategoryErrorMessages);
    }
  }
}
