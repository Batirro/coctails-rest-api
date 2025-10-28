import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { QueryCocktailsDto } from './dto/query-cocktails.dto';
import { Cocktail } from '@prisma/client';
import { UploadService } from '../upload/upload.service';
import { IngredientsService } from '../ingredients/ingredients.service';

/**
 * Service for managing cocktails
 * Handles CRUD operations, complex filtering, sorting, and pagination
 */
@Injectable()
export class CocktailsService {
  private readonly logger = new Logger(CocktailsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly ingredientsService: IngredientsService,
  ) {}

  /**
   * Create a new cocktail
   * Validates that all ingredient IDs exist before creating
   * @param createCocktailDto - Data for creating the cocktail
   * @returns The created cocktail with its ingredients
   */
  async create(createCocktailDto: CreateCocktailDto): Promise<any> {
    this.logger.log(`Creating new cocktail: ${createCocktailDto.name}`);

    // Validate that all ingredients exist
    const ingredientIds = createCocktailDto.ingredients.map(
      (i) => i.ingredientId,
    );
    const nonExistentIds =
      await this.ingredientsService.findNonExistentIds(ingredientIds);

    if (nonExistentIds.length > 0) {
      throw new BadRequestException(
        `The following ingredient IDs do not exist: ${nonExistentIds.join(', ')}`,
      );
    }

    // Create cocktail with ingredients
    const cocktail = await this.prisma.cocktail.create({
      data: {
        name: createCocktailDto.name,
        category: createCocktailDto.category,
        instructions: createCocktailDto.instructions,
        imageUrl: createCocktailDto.imageUrl,
        ingredients: {
          create: createCocktailDto.ingredients.map((ingredient) => ({
            ingredientId: ingredient.ingredientId,
            amount: ingredient.amount,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    this.logger.log(`Successfully created cocktail with id: ${cocktail.id}`);
    return cocktail;
  }

  /**
   * Find all cocktails with optional filtering, sorting, and pagination
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Paginated list of cocktails with metadata
   */
  async findAll(query: QueryCocktailsDto): Promise<{
    data: any[];
    meta: {
      total: number;
      offset: number;
      limit: number;
    };
  }> {
    const {
      category,
      nonAlcoholic,
      ingredientId,
      sortBy = 'name',
      sortOrder = 'asc',
      offset = 0,
      limit = 10,
    } = query;

    // Build where clause for filtering
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (ingredientId) {
      where.ingredients = {
        some: {
          ingredientId: ingredientId,
        },
      };
    }

    // Filter for non-alcoholic cocktails (all ingredients must be non-alcoholic)
    if (nonAlcoholic === true) {
      where.ingredients = {
        ...where.ingredients,
        every: {
          ingredient: {
            isAlcoholic: false,
          },
        },
      };
    }

    // Get total count for pagination metadata
    const total = await this.prisma.cocktail.count({ where });

    // Fetch cocktails with filters, sorting, and pagination
    const data = await this.prisma.cocktail.findMany({
      where,
      orderBy: {
        [sortBy as string]: sortOrder,
      },
      skip: offset,
      take: limit,
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    this.logger.log(
      `Found ${data.length} cocktails (total: ${total}, offset: ${offset}, limit: ${limit})`,
    );

    return {
      data,
      meta: {
        total,
        offset,
        limit,
      },
    };
  }

  /**
   * Find a single cocktail by ID
   * @param id - Cocktail ID
   * @returns The cocktail with its ingredients
   * @throws NotFoundException if cocktail doesn't exist
   */
  async findOne(id: string): Promise<any> {
    const cocktail = await this.prisma.cocktail.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!cocktail) {
      this.logger.warn(`Cocktail with id ${id} not found`);
      throw new NotFoundException(`Cocktail with id ${id} not found`);
    }

    return cocktail;
  }

  /**
   * Update a cocktail
   * If ingredients are provided, replaces all existing ingredients
   * @param id - Cocktail ID
   * @param updateCocktailDto - Data to update
   * @returns The updated cocktail
   * @throws NotFoundException if cocktail doesn't exist
   * @throws BadRequestException if ingredient IDs don't exist
   */
  async update(id: string, updateCocktailDto: UpdateCocktailDto): Promise<any> {
    // Check if cocktail exists
    await this.findOne(id);

    this.logger.log(`Updating cocktail with id: ${id}`);

    // If ingredients are provided, validate they exist
    if (updateCocktailDto.ingredients) {
      const ingredientIds = updateCocktailDto.ingredients.map(
        (i) => i.ingredientId,
      );
      const nonExistentIds =
        await this.ingredientsService.findNonExistentIds(ingredientIds);

      if (nonExistentIds.length > 0) {
        throw new BadRequestException(
          `The following ingredient IDs do not exist: ${nonExistentIds.join(', ')}`,
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      name: updateCocktailDto.name,
      category: updateCocktailDto.category,
      instructions: updateCocktailDto.instructions,
      imageUrl: updateCocktailDto.imageUrl,
    };

    // If ingredients are provided, replace all existing ones
    if (updateCocktailDto.ingredients) {
      updateData.ingredients = {
        deleteMany: {}, // Delete all existing ingredient relationships
        create: updateCocktailDto.ingredients.map((ingredient) => ({
          ingredientId: ingredient.ingredientId,
          amount: ingredient.amount,
        })),
      };
    }

    const cocktail = await this.prisma.cocktail.update({
      where: { id },
      data: updateData,
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    this.logger.log(`Successfully updated cocktail with id: ${id}`);
    return cocktail;
  }

  /**
   * Delete a cocktail
   * Also deletes the associated image file if it's a local upload
   * @param id - Cocktail ID
   * @throws NotFoundException if cocktail doesn't exist
   */
  async remove(id: string): Promise<{ message: string }> {
    // Check if cocktail exists
    const cocktail = await this.findOne(id);

    this.logger.log(`Deleting cocktail with id: ${id}`);

    // Delete the cocktail (cascade will delete ingredient relationships)
    await this.prisma.cocktail.delete({
      where: { id },
    });

    // Delete associated image file if it's a local upload
    if (cocktail.imageUrl) {
      await this.uploadService.deleteFileIfLocal(cocktail.imageUrl);
    }

    this.logger.log(`Successfully deleted cocktail with id: ${id}`);
    return { message: `Cocktail successfully deleted` };
  }
}
