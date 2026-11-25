import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreatePhotoDto } from './dto/create-photo.dto.js';

import { handlePrismaError } from '../prisma/utils/handle-prisma-error.js';

import { projectPhotoErrorMessages } from './config/project-photo-error-messages.js';
import { photoDetailsInclude } from './config/photo-details-include.js';

import type { PhotoDetails } from './types.js';

@Injectable()
export class PhotosService {
  constructor(private readonly prismaService: PrismaService) {}

  async createForProject(
    projectId: string,
    dto: CreatePhotoDto,
  ): Promise<PhotoDetails> {
    try {
      return await this.prismaService.photo.create({
        data: {
          sortOrder: dto.sortOrder,
          project: {
            connect: { id: projectId },
          },
          image: {
            connect: { id: dto.imageId },
          },
        },
        include: photoDetailsInclude,
      });
    } catch (error) {
      handlePrismaError(error, projectPhotoErrorMessages);
    }
  }
}
