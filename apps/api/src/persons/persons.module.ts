import { Module } from '@nestjs/common';

import { ImagesModule } from '../images/images.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { SocialMediasModule } from '../social-medias/social-medias.module.js';
import { PhotosModule } from '../photos/photos.module.js';

import { PersonsController } from './persons.controller.js';

import { PersonsService } from './persons.service.js';

import { PersonResponseMapper } from './mapper/person-response.mapper.js';

@Module({
  controllers: [PersonsController],
  providers: [PersonsService, PersonResponseMapper],
  imports: [
    PrismaModule,
    ImagesModule,
    CategoriesModule,
    SocialMediasModule,
    PhotosModule,
  ],
  exports: [PersonResponseMapper],
})
export class PersonsModule {}
