import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Project } from '../generated/prisma/client.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProjects(): Promise<Project[]> {
    return this.prismaService.project.findMany();
  }

  async getProject(id: string): Promise<Project | null> {
    return this.prismaService.project.findUnique({ where: { id } });
  }
}
