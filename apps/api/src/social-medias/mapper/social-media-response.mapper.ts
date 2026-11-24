import { Injectable } from '@nestjs/common';

import { ImageResponseMapper } from '../../images/mappers/image-response.mapper.js';

import type { ResponseSocialMediaDto } from '../dto/response-social-media.dto.js';
import type { SocialMediaDetails } from '../types.js';

@Injectable()
export class SocialMediaResponseMapper {
  constructor(private readonly imageResponseMapper: ImageResponseMapper) {}

  toDto(socialMedia: SocialMediaDetails): ResponseSocialMediaDto {
    const { id, icon, sortOrder, url, text } = socialMedia;

    return {
      id,
      icon: icon ? this.imageResponseMapper.toDto(icon) : null,
      sortOrder,
      url,
      text,
    };
  }
}
