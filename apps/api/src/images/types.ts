import { Image } from '../generated/prisma/client.js';

export type File = Express.Multer.File;

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  mimeType: 'image/webp';
}

export type ImageWithUrl = Image & { url: string };
