import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { SocialMediasService } from './social-medias.service.js';
import { SocialMediaResponseMapper } from './mapper/social-media-response.mapper.js';

import { CreateSocialMediaDto } from './dto/create-social-media.dto.js';
import { ResponseSocialMediaDto } from './dto/response-social-media.dto.js';

@Controller('persons/:id/social-medias')
export class PersonsSocialMediasController {
  constructor(
    private readonly socialMediasService: SocialMediasService,
    private readonly socialMediaResponseMapper: SocialMediaResponseMapper,
  ) {}

  @Post()
  async createSocialMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateSocialMediaDto,
  ): Promise<ResponseSocialMediaDto> {
    const socialMedia = await this.socialMediasService.create(id, dto);

    return this.socialMediaResponseMapper.toDto(socialMedia);
  }

  @Get()
  async getSocialMedias(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseSocialMediaDto[]> {
    const socialMedias = await this.socialMediasService.findAll(id);

    return socialMedias.map((socialMedia) =>
      this.socialMediaResponseMapper.toDto(socialMedia),
    );
  }
}
