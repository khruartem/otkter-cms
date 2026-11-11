import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsUUID()
  iconId?: string;
}
