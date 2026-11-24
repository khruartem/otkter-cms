import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreatePersonDto } from './dto/create-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';
import { AddPersonCategoryDto } from './dto/add-person-category.dto.js';

import { personDetailsInclude } from './config/person-details-include.js';
import { personCategoryErrorMessages } from './config/person-category-error-messages.js';

import { handlePersonError } from './utils/handle-person-error.js';
import { handlePrismaError } from '../prisma/utils/handle-prisma-error.js';

import type { PersonDetails } from './types.js';
import type { PersonCategory } from '../generated/prisma/client.js';

@Injectable()
export class PersonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreatePersonDto): Promise<PersonDetails> {
    try {
      return await this.prismaService.person.create({
        data: {
          ...dto,
        },
        include: personDetailsInclude,
      });
    } catch (error) {
      handlePersonError(error);
    }
  }

  async findAll(): Promise<PersonDetails[]> {
    return this.prismaService.person.findMany({
      include: personDetailsInclude,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
  }

  async findOne(id: string): Promise<PersonDetails> {
    const person = await this.prismaService.person.findUnique({
      where: { id },
      include: personDetailsInclude,
    });

    if (!person) {
      throw new NotFoundException('Персона не найдена!');
    }

    return person;
  }

  async update(id: string, dto: UpdatePersonDto): Promise<PersonDetails> {
    try {
      return await this.prismaService.person.update({
        where: { id },
        data: {
          ...dto,
        },
        include: personDetailsInclude,
      });
    } catch (error) {
      handlePersonError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.person.delete({
        where: { id },
      });
    } catch (error) {
      handlePersonError(error);
    }
  }

  async assignCategory(
    personId: string,
    dto: AddPersonCategoryDto,
  ): Promise<PersonCategory> {
    try {
      return await this.prismaService.personCategory.create({
        data: {
          personId,
          ...dto,
        },
      });
    } catch (error) {
      handlePrismaError(error, personCategoryErrorMessages);
    }
  }

  async unassignCategory(personId: string, categoryId: string): Promise<void> {
    try {
      await this.prismaService.personCategory.delete({
        where: {
          personId_categoryId: {
            personId,
            categoryId,
          },
        },
      });
    } catch (error) {
      handlePrismaError(error, personCategoryErrorMessages);
    }
  }
}
