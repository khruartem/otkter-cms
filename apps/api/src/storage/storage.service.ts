import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private readonly endpoint: string;
  private readonly region: string;
  private readonly bucket: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly s3Client: S3Client;

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
}
