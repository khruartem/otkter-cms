import { Module } from '@nestjs/common';

import { ImagesModule } from '../images/images.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

import { ProjectPhotosController } from './project-photos.controller.js';

import { PhotosService } from './photos.service.js';
import { PhotoResponseMapper } from './mapper/photo-response.mapper.js';

@Module({
  providers: [PhotosService, PhotoResponseMapper],
  controllers: [ProjectPhotosController],
  imports: [PrismaModule, ImagesModule],
})
export class PhotosModule {}
