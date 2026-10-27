import { ConflictException, Injectable } from '@nestjs/common';

import { Prisma, type Project } from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateProjectDto } from './dto/create-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProjects(): Promise<Project[]> {
    return this.prismaService.project.findMany();
  }

  async getProject(id: string): Promise<Project | null> {
    return this.prismaService.project.findUnique({ where: { id } });
  }

  async createProject(dto: CreateProjectDto): Promise<Project> {
    try {
      return await this.prismaService.project.create({
        data: {
          ...dto,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Проект с таким slug уже существует');
      }
      throw error;
    }
  }
}
