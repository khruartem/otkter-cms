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
} from '@nestjs/common';

import { SocialMediasService } from './social-medias.service.js';
import { SocialMediaResponseMapper } from './mapper/social-media-response.mapper.js';

import { ResponseSocialMediaDto } from './dto/response-social-media.dto.js';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto.js';

@Controller('social-medias')
export class SocialMediasController {
  constructor(
    private readonly socialMediasService: SocialMediasService,
    private readonly socialMediaResponseMapper: SocialMediaResponseMapper,
  ) {}

  @Get(':id')
  async getSocialMedia(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseSocialMediaDto> {
    const socialMedia = await this.socialMediasService.findOne(id);

    return this.socialMediaResponseMapper.toDto(socialMedia);
  }

  @Patch(':id')
  async updateSocialMedia(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSocialMediaDto,
  ): Promise<ResponseSocialMediaDto> {
    const socialMedia = await this.socialMediasService.update(id, dto);

    return this.socialMediaResponseMapper.toDto(socialMedia);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSocialMedia(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.socialMediasService.remove(id);
  }
}
