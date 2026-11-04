const allowedFormats = ['jpeg', 'png', 'webp'] as const;

export const IMAGE_CONFIG = {
  maxFileSize: 5 * 1024 * 1024,
  maxInputPixels: 25_000_000,
  allowedFormats,
  storageKeyPrefix: 'images',
  allowedMimeTypes: new RegExp(`^image/(${allowedFormats.join('|')})$`),
  webpQuality: 85,
} as const;
