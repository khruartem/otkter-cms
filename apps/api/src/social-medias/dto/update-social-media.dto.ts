import { PartialType } from '@nestjs/mapped-types';
import { CreateSocialMediaDto } from './create-social-media.dto.js';

export class UpdateSocialMediaDto extends PartialType(CreateSocialMediaDto, {
  skipNullProperties: false,
}) {}
