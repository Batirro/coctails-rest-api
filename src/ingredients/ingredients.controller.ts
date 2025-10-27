import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { QueryIngredientsDto } from './dto/query-ingredients.dto';

/**
 * Controller for managing ingredients
 * Provides REST API endpoints for CRUD operations on ingredients
 */
@ApiTags('Ingredients')
@Controller('api/ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  /**
   * Create a new ingredient
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new ingredient',
    description: 'Creates a new ingredient with the provided data',
  })
  @ApiResponse({
    status: 201,
    description: 'Ingredient successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        name: { type: 'string', example: 'White Rum' },
        description: {
          type: 'string',
          example: 'A light-bodied rum commonly used in cocktails',
        },
        isAlcoholic: { type: 'boolean', example: true },
        imageUrl: { type: 'string', example: '/uploads/white-rum.jpg' },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00Z' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  /**
   * Get all ingredients with optional filtering, sorting, and pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all ingredients',
    description:
      'Retrieve a paginated list of ingredients with optional filtering and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'List of ingredients successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              isAlcoholic: { type: 'boolean' },
              imageUrl: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 50 },
            offset: { type: 'number', example: 0 },
            limit: { type: 'number', example: 10 },
          },
        },
      },
    },
  })
  findAll(@Query() query: QueryIngredientsDto) {
    return this.ingredientsService.findAll(query);
  }

  /**
   * Get a single ingredient by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get an ingredient by ID',
    description: 'Retrieve a single ingredient by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Ingredient ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingredient successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        isAlcoholic: { type: 'boolean' },
        imageUrl: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found',
  })
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(id);
  }

  /**
   * Update an ingredient
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an ingredient',
    description: 'Update an existing ingredient with new data',
  })
  @ApiParam({
    name: 'id',
    description: 'Ingredient ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingredient successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        isAlcoholic: { type: 'boolean' },
        imageUrl: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  /**
   * Delete an ingredient
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an ingredient',
    description:
      'Delete an ingredient. Returns an error if the ingredient is used in any cocktails.',
  })
  @ApiParam({
    name: 'id',
    description: 'Ingredient ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Ingredient successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Ingredient successfully deleted',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Ingredient not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ingredient is used in cocktails and cannot be deleted',
  })
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(id);
  }
}
