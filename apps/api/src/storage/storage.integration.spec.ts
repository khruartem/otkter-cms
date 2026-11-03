import { describe, it, expect } from 'vitest';

import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { randomUUID } from 'node:crypto';

import { StorageModule } from './storage.module.js';
import { StorageService } from './storage.service.js';

describe('Интеграционный тест StorageService', () => {
  it('Должен загружать и удалять объект из S3', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '../../.env',
        }),
        StorageModule,
      ],
    }).compile();

    const storageService = moduleRef.get(StorageService);
    expect(storageService).toBeInstanceOf(StorageService);

    const key = `tests/${randomUUID()}.txt`;
    const body = Buffer.from('Storage integration test');
    const contentType = 'text/plain';

    try {
      await storageService.upload(key, body, contentType);

      const url = `https://storage.yandexcloud.net/otkter-cms-media/${key}`;

      const response = await fetch(url);
      expect(response.status).toBe(200);

      const downloadedBody = Buffer.from(await response.arrayBuffer());
      expect(downloadedBody).toEqual(body);
    } finally {
      try {
        await storageService.delete(key);
      } finally {
        await moduleRef.close();
      }
    }
  });
});
