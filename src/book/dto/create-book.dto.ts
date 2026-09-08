import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreateBookDto {
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  readonly title!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must contain lowercase letters, numbers, and hyphens only',
  })
  readonly slug!: string;

  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(10_000)
  readonly description?: string | null;
}
