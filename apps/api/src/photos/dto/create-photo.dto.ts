import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';

export class CreatePhotoDto {
  @IsUUID()
  @IsNotEmpty()
  imageId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  sortOrder?: number;
}
