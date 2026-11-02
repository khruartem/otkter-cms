import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly endpoint: string;
  private readonly region: string;
  private readonly bucket: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');
    this.region = this.configService.getOrThrow<string>('S3_REGION');
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET');
    this.accessKeyId =
      this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.getOrThrow<string>(
      'S3_SECRET_ACCESS_KEY',
    );

    const s3ClientConfig: S3ClientConfig = {
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    };

    this.s3Client = new S3Client(s3ClientConfig);
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting to Yandex Cloud S3 bucket...');

    const command = new HeadBucketCommand({
      Bucket: this.bucket,
    });

    try {
      await this.s3Client.send(command);

      this.logger.log('Yandex Cloud S3 bucket is accessible');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`Yandex Cloud S3 bucket connection failed: ${message}`);
      throw error;
    }
  }

  async upload(key: string, body: Buffer, contentType: string): Promise<void> {
    const input = {
      Key: key,
      Body: body,
      ContentType: contentType,
      Bucket: this.bucket,
    };

    const command = new PutObjectCommand(input);

    await this.s3Client.send(command);
  }

  async delete(key: string): Promise<void> {
    const input = {
      Key: key,
      Bucket: this.bucket,
    };

    const command = new DeleteObjectCommand(input);

    await this.s3Client.send(command);
  }
}
