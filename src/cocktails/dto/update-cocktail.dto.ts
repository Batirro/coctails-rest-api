import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CocktailCategory } from '../../common/enums/cocktail-category.enum';
import { AddIngredientDto } from './add-ingredient.dto';

/**
 * DTO for updating an existing cocktail
 * All fields are optional to allow partial updates
 */
export class UpdateCocktailDto {
  @ApiPropertyOptional({
    description: 'Name of the cocktail',
    example: 'Mojito',
    minLength: 3,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Category of the cocktail',
    enum: CocktailCategory,
    example: CocktailCategory.CLASSIC,
  })
  @IsOptional()
  @IsEnum(CocktailCategory, {
    message: `Category must be one of: ${Object.values(CocktailCategory).join(', ')}`,
  })
  category?: CocktailCategory;

  @ApiPropertyOptional({
    description: 'Instructions for making the cocktail',
    example: 'Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Instructions must not exceed 5000 characters' })
  instructions?: string;

  @ApiPropertyOptional({
    description: 'URL to the cocktail image',
    example: '/uploads/mojito.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Image URL must not exceed 500 characters' })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'List of ingredients with amounts (will replace existing ingredients)',
    type: [AddIngredientDto],
    example: [
      {
        ingredientId: '550e8400-e29b-41d4-a716-446655440000',
        amount: '50ml',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddIngredientDto)
  ingredients?: AddIngredientDto[];
}
