import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { PersonsService } from './persons.service.js';
import { PersonResponseMapper } from './mapper/person-response.mapper.js';

import type { CreatePersonDto } from './dto/create-person.dto.js';
import type { ResponsePersonDto } from './dto/response-person.dto.js';
import type { UpdatePersonDto } from './dto/update-person.dto.js';
import type { AddPersonCategoryDto } from './dto/add-person-category.dto.js';

import type { PersonCategory } from '../generated/prisma/client.js';

@Controller('persons')
export class PersonsController {
  constructor(
    private readonly personsService: PersonsService,
    private readonly personResponseMapper: PersonResponseMapper,
  ) {}

  @Post()
  async createPerson(@Body() dto: CreatePersonDto): Promise<ResponsePersonDto> {
    const person = await this.personsService.create(dto);

    return this.personResponseMapper.toDto(person);
  }

  @Get()
  async getPersons(): Promise<ResponsePersonDto[]> {
    const persons = await this.personsService.findAll();

    return persons.map((person) => this.personResponseMapper.toDto(person));
  }

  @Get(':id')
  async getPerson(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponsePersonDto> {
    const person = await this.personsService.findOne(id);

    return this.personResponseMapper.toDto(person);
  }

  @Patch(':id')
  async updatePerson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePersonDto,
  ): Promise<ResponsePersonDto> {
    const person = await this.personsService.update(id, dto);

    return this.personResponseMapper.toDto(person);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePerson(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.personsService.remove(id);
  }

  @Post(':id/categories')
  async addPersonCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddPersonCategoryDto,
  ): Promise<PersonCategory> {
    return this.personsService.assignCategory(id, dto);
  }

  @Delete(':id/categories/:categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePersonCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<void> {
    await this.personsService.unassignCategory(id, categoryId);
  }
}
