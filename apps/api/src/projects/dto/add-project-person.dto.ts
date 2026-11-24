import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AddProjectPersonDto {
  @IsUUID()
  @IsNotEmpty()
  personId!: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  extra?: string;
}
