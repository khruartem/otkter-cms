import sharp from 'sharp';

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { StorageService } from '../storage/storage.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

import { File, ProcessedImage, ImageWithUrl } from './types.js';

import { IMAGE_CONFIG } from './config/image.config.js';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

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

  private generateStorageKey(): string {
    return `${IMAGE_CONFIG.storageKeyPrefix}/${randomUUID()}.webp`;
  }

  async upload(file: File): Promise<ImageWithUrl> {
    const processedImage = await this.processImage(file.buffer);
    const { buffer, ...metadata } = processedImage;

    const storageKey = this.generateStorageKey();

    await this.storageService.upload(storageKey, buffer, metadata.mimeType);

    try {
      const image = await this.prismaService.image.create({
        data: {
          storageKey,
          ...metadata,
        },
      });

      return {
        url: this.storageService.getPublicUrl(storageKey),
        ...image,
      };
    } catch (error) {
      try {
        await this.storageService.delete(storageKey);
      } catch (cleanupError) {
        this.logger.error(cleanupError);
      }

      throw error;
    }
  }

  async getImage(id: string): Promise<ImageWithUrl> {
    const image = await this.prismaService.image.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException('Изображение не найдено!');
    }

    return {
      url: this.storageService.getPublicUrl(image.storageKey),
      ...image,
    };
  }
}
