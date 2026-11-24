import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateSocialMediaDto } from './dto/create-social-media.dto.js';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto.js';

import { handlePrismaError } from '../prisma/utils/handle-prisma-error.js';

import { socialMediaDetailsInclude } from './config/social-media-details-include.js';

import type { SocialMediaDetails } from './types.js';
import { socialMediaErrorMessages } from './config/social-media-error-messages.js';

@Injectable()
export class SocialMediasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    personId: string,
    dto: CreateSocialMediaDto,
  ): Promise<SocialMediaDetails> {
    try {
      return await this.prismaService.socialMedia.create({
        data: {
          personId,
          ...dto,
        },
        include: socialMediaDetailsInclude,
      });
    } catch (error) {
      handlePrismaError(error, socialMediaErrorMessages);
    }
  }

  async findAll(personId: string): Promise<SocialMediaDetails[]> {
    return this.prismaService.socialMedia.findMany({
      where: {
        personId,
      },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: socialMediaDetailsInclude,
    });
  }

  async findOne(id: string): Promise<SocialMediaDetails> {
    const socialMedia = await this.prismaService.socialMedia.findUnique({
      where: {
        id,
      },
      include: socialMediaDetailsInclude,
    });

    if (!socialMedia) {
      throw new NotFoundException('Соц. сеть не найдена!');
    }

    return socialMedia;
  }

  async update(
    id: string,
    dto: UpdateSocialMediaDto,
  ): Promise<SocialMediaDetails> {
    try {
      return await this.prismaService.socialMedia.update({
        where: { id },
        data: {
          ...dto,
        },
        include: socialMediaDetailsInclude,
      });
    } catch (error) {
      handlePrismaError(error, socialMediaErrorMessages);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.socialMedia.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error, socialMediaErrorMessages);
    }
  }
}
