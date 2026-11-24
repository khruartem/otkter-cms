import { OmitType, PartialType } from '@nestjs/mapped-types';

import { AddProjectPersonDto } from './add-project-person.dto.js';

export class UpdateProjectPersonDto extends OmitType(
  PartialType(AddProjectPersonDto, {
    skipNullProperties: false,
  }),
  ['personId'] as const,
) {}
