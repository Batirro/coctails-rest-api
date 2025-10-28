import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CocktailCategory } from '../../common/enums/cocktail-category.enum';

/**
 * Sort order enum
 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Valid sort fields for cocktails
 */
export enum CocktailSortBy {
  NAME = 'name',
  CATEGORY = 'category',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

/**
 * DTO for querying cocktails with filtering, sorting, and pagination
 */
export class QueryCocktailsDto {
  @ApiPropertyOptional({
    description: 'Filter by cocktail category',
    enum: CocktailCategory,
    example: CocktailCategory.TROPICAL,
  })
  @IsOptional()
  @IsEnum(CocktailCategory)
  category?: CocktailCategory;

  @ApiPropertyOptional({
    description: 'Filter for non-alcoholic cocktails only (cocktails with no alcoholic ingredients)',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  nonAlcoholic?: boolean;

  @ApiPropertyOptional({
    description: 'Filter cocktails that contain a specific ingredient (by ingredient ID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  ingredientId?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: CocktailSortBy,
    default: CocktailSortBy.NAME,
  })
  @IsOptional()
  @IsEnum(CocktailSortBy)
  sortBy?: CocktailSortBy = CocktailSortBy.NAME;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: SortOrder,
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;

  @ApiPropertyOptional({
    description: 'Number of items to skip',
    default: 0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Number of items to return',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
