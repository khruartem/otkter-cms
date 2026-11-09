import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller.js';
import { ImagesService } from './images.service.js';
import { StorageModule } from '../storage/storage.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ImageResponseMapper } from './mappers/image-response.mapper.js';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, ImageResponseMapper],
  imports: [StorageModule, PrismaModule],
  exports: [ImageResponseMapper],
})
export class ImagesModule {}
