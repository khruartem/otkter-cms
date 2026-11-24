import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';

import { ProjectsService } from './projects.service.js';
import { UpdateProjectPersonDto } from './dto/update-project-person.dto.js';
import { ProjectPerson } from '../generated/prisma/client.js';

@Controller('project-persons')
export class ProjectPersonController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProjectPerson(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.projectsService.unassignPerson(id);
  }

  @Patch(':id')
  async updateProjectPerson(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectPersonDto,
  ): Promise<ProjectPerson> {
    return this.projectsService.updatePerson(id, dto);
  }
}
