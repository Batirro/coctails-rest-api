import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO for adding an ingredient to a cocktail with its amount
 * Used as a nested object in CreateCocktailDto
 */
export class AddIngredientDto {
  @ApiProperty({
    description: 'ID of the ingredient',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ingredient ID is required' })
  ingredientId: string;

  @ApiProperty({
    description: 'Amount of the ingredient needed (e.g., "50ml", "2 tablespoons", "3 drops")',
    example: '50ml',
  })
  @IsString()
  @IsNotEmpty({ message: 'Amount is required' })
  @MinLength(1, { message: 'Amount must not be empty' })
  amount: string;
}
