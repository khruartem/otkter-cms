import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddPersonCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;
}
