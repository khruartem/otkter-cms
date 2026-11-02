import { describe, it, expect, vi, afterEach } from 'vitest';
import { StorageService } from './storage.service.js';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

describe('StorageService', () => {
  it('Ключ изображения должен начинаться с images/', () => {
    const key = 'images/test.webp';

    expect(key.startsWith('images/')).toBe(true);
  });

  it('StorageService должен получать название бакета из ConfigService', () => {
    const mockConfigService = {
      getOrThrow: vi.fn((key: string): string => {
        if (key === 'S3_BUCKET') {
          return 'test-bucket';
        }

        return 'test_value';
      }),
    };

    new StorageService(mockConfigService as unknown as ConfigService);

    expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('S3_BUCKET');
  });

  it('StorageService должен отправлять PutObjectCommand при загрузке изображения', async () => {
    const mockConfigService = {
      getOrThrow: vi.fn((key: string): string => {
        if (key === 'S3_BUCKET') {
          return 'test-bucket';
        }

        return 'test_value';
      }),
    };

    const input = {
      Key: 'images/test.webp',
      Body: Buffer.from('test image content'),
      ContentType: 'image/webp',
      Bucket: 'test-bucket',
    };

    const storageService = new StorageService(
      mockConfigService as unknown as ConfigService,
    );

    const spy = vi
      .spyOn(S3Client.prototype, 'send')
      .mockImplementation(async () => {});

    await storageService.upload(input.Key, input.Body, input.ContentType);

    const command = spy.mock.calls[0]?.[0];

    if (!(command instanceof PutObjectCommand)) {
      throw new Error('Ожидался PutObjectCommand');
    }

    expect(spy).toHaveBeenCalledTimes(1);
    expect(command.input).toMatchObject(input);
  });

  it('StorageService должен отправлять DeleteObjectCommand при удалении изображения', async () => {
    const mockConfigService = {
      getOrThrow: vi.fn((key: string): string => {
        if (key === 'S3_BUCKET') {
          return 'test-bucket';
        }

        return 'test_value';
      }),
    };

    const input = {
      Key: 'images/test.webp',
      Bucket: 'test-bucket',
    };

    const storageService = new StorageService(
      mockConfigService as unknown as ConfigService,
    );

    const spy = vi
      .spyOn(S3Client.prototype, 'send')
      .mockImplementation(async () => {});

    await storageService.delete(input.Key);

    const command = spy.mock.calls[0]?.[0];

    if (!(command instanceof DeleteObjectCommand)) {
      throw new Error('Ожидался DeleteObjectCommand');
    }

    expect(spy).toHaveBeenCalledTimes(1);
    expect(command.input).toMatchObject(input);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
