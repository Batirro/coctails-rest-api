import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

/**
 * DTO for creating a new ingredient
 */
export class CreateIngredientDto {
  @ApiProperty({
    description: 'Name of the ingredient',
    example: 'White Rum',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Description of the ingredient',
    example: 'A light-bodied rum commonly used in cocktails',
    maxLength: 2000,
  })
  @IsString()
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description: string;

  @ApiProperty({
    description: 'Whether the ingredient is alcoholic',
    example: true,
  })
  @IsBoolean()
  isAlcoholic: boolean;

  @ApiProperty({
    description: 'URL to the ingredient image (optional)',
    example: '/uploads/white-rum.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Image URL must not exceed 500 characters' })
  imageUrl?: string;
}
