export type File = Express.Multer.File;

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  mimeType: 'image/webp';
}
