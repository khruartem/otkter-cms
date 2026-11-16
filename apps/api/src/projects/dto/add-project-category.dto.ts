import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddProjectCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
