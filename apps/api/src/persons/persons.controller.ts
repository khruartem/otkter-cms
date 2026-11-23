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
import { CreatePersonDto } from './dto/create-person.dto.js';
import { ResponsePersonDto } from './dto/response-person.dto.js';
import { UpdatePersonDto } from './dto/update-person.dto.js';

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
}
