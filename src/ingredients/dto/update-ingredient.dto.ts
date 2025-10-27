import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

/**
 * DTO for updating an existing ingredient
 * All fields are optional to allow partial updates
 */
export class UpdateIngredientDto {
  @ApiPropertyOptional({
    description: 'Name of the ingredient',
    example: 'White Rum',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the ingredient',
    example: 'A light-bodied rum commonly used in cocktails',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the ingredient is alcoholic',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAlcoholic?: boolean;

  @ApiPropertyOptional({
    description: 'URL to the ingredient image',
    example: '/uploads/white-rum.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Image URL must not exceed 500 characters' })
  imageUrl?: string;
}
