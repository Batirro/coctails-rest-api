import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CocktailCategory } from '../../common/enums/cocktail-category.enum';
import { AddIngredientDto } from './add-ingredient.dto';

/**
 * DTO for creating a new cocktail
 * NOTE: Ingredients are REQUIRED when creating a cocktail
 */
export class CreateCocktailDto {
  @ApiProperty({
    description: 'Name of the cocktail',
    example: 'Mojito',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Category of the cocktail',
    enum: CocktailCategory,
    example: CocktailCategory.CLASSIC,
  })
  @IsEnum(CocktailCategory, {
    message: `Category must be one of: ${Object.values(CocktailCategory).join(', ')}`,
  })
  category: CocktailCategory;

  @ApiProperty({
    description: 'Instructions for making the cocktail',
    example: 'Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.',
    maxLength: 5000,
  })
  @IsString()
  @MaxLength(5000, { message: 'Instructions must not exceed 5000 characters' })
  instructions: string;

  @ApiProperty({
    description: 'URL to the cocktail image (optional)',
    example: '/uploads/mojito.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Image URL must not exceed 500 characters' })
  imageUrl?: string;

  @ApiProperty({
    description: 'List of ingredients with amounts (REQUIRED - at least one ingredient must be provided)',
    type: [AddIngredientDto],
    example: [
      {
        ingredientId: '550e8400-e29b-41d4-a716-446655440000',
        amount: '50ml',
      },
      {
        ingredientId: '660e8400-e29b-41d4-a716-446655440001',
        amount: '10 mint leaves',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, {
    message: 'At least one ingredient is required when creating a cocktail',
  })
  @ValidateNested({ each: true })
  @Type(() => AddIngredientDto)
  ingredients: AddIngredientDto[];
}
