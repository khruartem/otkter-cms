import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

import sharp from 'sharp';
import { IMAGE_CONFIG } from './config/image.config.js';

interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  mimeType: 'image/webp';
}

@Injectable()
export class ImagesService {
  constructor(
    private readonly storageService: StorageService,
    private readonly prismaService: PrismaService,
  ) {}

  private async processImage(inputBuffer: Buffer): Promise<ProcessedImage> {
    const allowedFormats: readonly string[] = IMAGE_CONFIG.allowedFormats;
    const limitInputPixels = IMAGE_CONFIG.maxInputPixels;

    const outputImage = sharp(inputBuffer, { limitInputPixels });

    const inputMetadata = await outputImage.metadata();
    if (!allowedFormats.includes(inputMetadata.format)) {
      throw new BadRequestException(
        'Недопустимый формат файла! Разрешены только JPG, PNG и WEBP.',
      );
    }

    const { data, info } = await outputImage
      .webp({ quality: IMAGE_CONFIG.webpQuality })
      .toBuffer({ resolveWithObject: true });

    return {
      buffer: data,
      width: info.width,
      height: info.height,
      size: info.size,
      mimeType: 'image/webp',
    };
  }
}
