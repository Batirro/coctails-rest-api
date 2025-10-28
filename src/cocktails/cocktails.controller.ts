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
} from '@nestjs/swagger';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { QueryCocktailsDto } from './dto/query-cocktails.dto';

/**
 * Controller for managing cocktails
 * Provides REST API endpoints for CRUD operations on cocktails
 */
@ApiTags('Cocktails')
@Controller('api/cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  /**
   * Create a new cocktail
   * NOTE: At least one ingredient is required when creating a cocktail
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new cocktail',
    description:
      'Creates a new cocktail with the provided data. IMPORTANT: At least one ingredient with amount is required.',
  })
  @ApiResponse({
    status: 201,
    description: 'Cocktail successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        name: { type: 'string', example: 'Mojito' },
        category: { type: 'string', example: 'CLASSIC' },
        instructions: {
          type: 'string',
          example: 'Muddle mint leaves with sugar and lime juice...',
        },
        imageUrl: { type: 'string', example: '/uploads/mojito.jpg' },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00Z' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ingredientId: { type: 'string' },
              amount: { type: 'string' },
              ingredient: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  isAlcoholic: { type: 'boolean' },
                  imageUrl: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data or ingredient IDs do not exist. Remember: at least one ingredient is required!',
  })
  create(@Body() createCocktailDto: CreateCocktailDto) {
    return this.cocktailsService.create(createCocktailDto);
  }

  /**
   * Get all cocktails with optional filtering, sorting, and pagination
   */
  @Get()
  @ApiOperation({
    summary: 'Get all cocktails',
    description:
      'Retrieve a paginated list of cocktails with optional filtering (by category, non-alcoholic, ingredient) and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'List of cocktails successfully retrieved',
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
              category: { type: 'string' },
              instructions: { type: 'string' },
              imageUrl: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
              ingredients: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    ingredientId: { type: 'string' },
                    amount: { type: 'string' },
                    ingredient: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        isAlcoholic: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
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
  findAll(@Query() query: QueryCocktailsDto) {
    return this.cocktailsService.findAll(query);
  }

  /**
   * Get a single cocktail by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get a cocktail by ID',
    description:
      'Retrieve a single cocktail by its unique identifier with all its ingredients',
  })
  @ApiParam({
    name: 'id',
    description: 'Cocktail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cocktail successfully retrieved',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        category: { type: 'string' },
        instructions: { type: 'string' },
        imageUrl: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              ingredientId: { type: 'string' },
              amount: { type: 'string' },
              ingredient: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  isAlcoholic: { type: 'boolean' },
                  imageUrl: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cocktail not found',
  })
  findOne(@Param('id') id: string) {
    return this.cocktailsService.findOne(id);
  }

  /**
   * Update a cocktail
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a cocktail',
    description:
      'Update an existing cocktail with new data. If ingredients are provided, they will replace all existing ingredients.',
  })
  @ApiParam({
    name: 'id',
    description: 'Cocktail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cocktail successfully updated',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        category: { type: 'string' },
        instructions: { type: 'string' },
        imageUrl: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cocktail not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or ingredient IDs do not exist',
  })
  update(
    @Param('id') id: string,
    @Body() updateCocktailDto: UpdateCocktailDto,
  ) {
    return this.cocktailsService.update(id, updateCocktailDto);
  }

  /**
   * Delete a cocktail
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a cocktail',
    description:
      'Delete a cocktail and its associated uploaded image file (if any).',
  })
  @ApiParam({
    name: 'id',
    description: 'Cocktail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Cocktail successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Cocktail successfully deleted',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cocktail not found',
  })
  remove(@Param('id') id: string) {
    return this.cocktailsService.remove(id);
  }
}
