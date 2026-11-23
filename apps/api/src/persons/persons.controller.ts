import { Body, Controller, Post } from '@nestjs/common';
import { PersonsService } from './persons.service.js';
import { PersonResponseMapper } from './mapper/person-response.mapper.js';
import { CreatePersonDto } from './dto/create-person.dto.js';
import { PersonResponseDto } from './dto/person-response.dto.js';

@Controller('persons')
export class PersonsController {
  constructor(
    private readonly personsService: PersonsService,
    private readonly personResponseMapper: PersonResponseMapper,
  ) {}

  @Post()
  async createPerson(@Body() dto: CreatePersonDto): Promise<PersonResponseDto> {
    const person = await this.personsService.create(dto);

    return this.personResponseMapper.toDto(person);
  }
}
