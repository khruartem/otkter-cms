import { Injectable, NotFoundException } from '@nestjs/common';

import { type Project } from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { handleProjectError } from './utils/handle-project-error.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProjects(): Promise<Project[]> {
    return this.prismaService.project.findMany();
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.prismaService.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException('Проект не найден!');
    }

    return project;
  }

  async createProject(dto: CreateProjectDto): Promise<Project> {
    try {
      return await this.prismaService.project.create({
        data: {
          ...dto,
        },
      });
    } catch (error) {
      handleProjectError(error);
    }
  }

  async updateProject(id: string, dto: UpdateProjectDto): Promise<Project> {
    try {
      return await this.prismaService.project.update({
        where: { id },
        data: { ...dto },
      });
    } catch (error) {
      handleProjectError(error);
    }
  }
}
