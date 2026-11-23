import { Module } from '@nestjs/common';

import { ImagesModule } from '../images/images.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

import { PersonsController } from './persons.controller.js';

import { PersonsService } from './persons.service.js';

import { PersonResponseMapper } from './mapper/person-response.mapper.js';

@Module({
  controllers: [PersonsController],
  providers: [PersonsService, PersonResponseMapper],
  imports: [PrismaModule, ImagesModule],
})
export class PersonsModule {}
