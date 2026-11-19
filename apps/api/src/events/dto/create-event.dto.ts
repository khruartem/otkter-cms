import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  place!: string;

  @IsDateString()
  @Matches(/(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/i)
  @IsNotEmpty()
  dateTime!: string;

  @IsString()
  @IsOptional()
  label?: string | null;
}
