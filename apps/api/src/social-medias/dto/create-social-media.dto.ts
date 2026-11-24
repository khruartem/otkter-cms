import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateSocialMediaDto {
  @IsUUID()
  @IsOptional()
  iconId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  sortOrder?: number;

  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsNotEmpty()
  text!: string;
}
