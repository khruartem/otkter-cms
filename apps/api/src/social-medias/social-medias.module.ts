import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { ImagesModule } from '../images/images.module.js';

import { SocialMediasController } from './social-medias.controller.js';
import { PersonsSocialMediasController } from './persons-social-medias.controller.js';

import { SocialMediasService } from './social-medias.service.js';
import { SocialMediaResponseMapper } from './mapper/social-media-response.mapper.js';

@Module({
  controllers: [SocialMediasController, PersonsSocialMediasController],
  providers: [SocialMediasService, SocialMediaResponseMapper],
  imports: [PrismaModule, ImagesModule],
  exports: [SocialMediaResponseMapper],
})
export class SocialMediasModule {}
