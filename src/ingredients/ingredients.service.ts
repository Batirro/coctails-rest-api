import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { QueryIngredientsDto } from './dto/query-ingredients.dto';
import { Ingredient } from '@prisma/client';
import { UploadService } from '../upload/upload.service';

/**
 * Service for managing ingredients
 * Handles CRUD operations, filtering, sorting, and pagination
 */
@Injectable()
export class IngredientsService {
  private readonly logger = new Logger(IngredientsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Create a new ingredient
   * @param createIngredientDto - Data for creating the ingredient
   * @returns The created ingredient
   */
  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    this.logger.log(`Creating new ingredient: ${createIngredientDto.name}`);

    const ingredient = await this.prisma.ingredient.create({
      data: createIngredientDto,
    });

    this.logger.log(
      `Successfully created ingredient with id: ${ingredient.id}`,
    );
    return ingredient;
  }

  /**
   * Find all ingredients with optional filtering, sorting, and pagination
   * @param query - Query parameters for filtering, sorting, and pagination
   * @returns Paginated list of ingredients with metadata
   */
  async findAll(query: QueryIngredientsDto): Promise<{
    data: Ingredient[];
    meta: {
      total: number;
      offset: number;
      limit: number;
    };
  }> {
    const {
      isAlcoholic,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      offset = 0,
      limit = 10,
    } = query;

    // Build where clause for filtering
    const where: any = {};

    if (isAlcoholic !== undefined) {
      where.isAlcoholic = isAlcoholic;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Get total count for pagination metadata
    const total = await this.prisma.ingredient.count({ where });

    // Fetch ingredients with filters, sorting, and pagination
    const data = await this.prisma.ingredient.findMany({
      where,
      orderBy: {
        [sortBy as string]: sortOrder,
      },
      skip: offset,
      take: limit,
    });

    this.logger.log(
      `Found ${data.length} ingredients (total: ${total}, offset: ${offset}, limit: ${limit})`,
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
   * Find a single ingredient by ID
   * @param id - Ingredient ID
   * @returns The ingredient if found
   * @throws NotFoundException if ingredient doesn't exist
   */
  async findOne(id: string): Promise<Ingredient> {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });

    if (!ingredient) {
      this.logger.warn(`Ingredient with id ${id} not found`);
      throw new NotFoundException(`Ingredient with id ${id} not found`);
    }

    return ingredient;
  }

  /**
   * Update an ingredient
   * @param id - Ingredient ID
   * @param updateIngredientDto - Data to update
   * @returns The updated ingredient
   * @throws NotFoundException if ingredient doesn't exist
   */
  async update(
    id: string,
    updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    // Check if ingredient exists
    await this.findOne(id);

    this.logger.log(`Updating ingredient with id: ${id}`);

    const ingredient = await this.prisma.ingredient.update({
      where: { id },
      data: updateIngredientDto,
    });

    this.logger.log(`Successfully updated ingredient with id: ${id}`);
    return ingredient;
  }

  /**
   * Delete an ingredient
   * Checks if the ingredient is used in any cocktails before deletion
   * @param id - Ingredient ID
   * @throws NotFoundException if ingredient doesn't exist
   * @throws ConflictException if ingredient is used in cocktails
   */
  async remove(id: string): Promise<{ message: string }> {
    // Check if ingredient exists
    const ingredient = await this.findOne(id);

    // Check if ingredient is used in any cocktails
    const cocktailsCount = await this.prisma.cocktailIngredient.count({
      where: { ingredientId: id },
    });

    if (cocktailsCount > 0) {
      this.logger.warn(
        `Cannot delete ingredient ${id}: used in ${cocktailsCount} cocktail(s)`,
      );
      throw new ConflictException(
        `Cannot delete ingredient. It is used in ${cocktailsCount} cocktail(s). Please remove it from all cocktails before deleting.`,
      );
    }

    this.logger.log(`Deleting ingredient with id: ${id}`);

    // Delete the ingredient
    await this.prisma.ingredient.delete({
      where: { id },
    });

    // Delete associated image file if it's a local upload
    if (ingredient.imageUrl) {
      await this.uploadService.deleteFileIfLocal(ingredient.imageUrl);
    }

    this.logger.log(`Successfully deleted ingredient with id: ${id}`);
    return { message: `Ingredient successfully deleted` };
  }

  /**
   * Check if an ingredient exists
   * @param id - Ingredient ID
   * @returns true if exists, false otherwise
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.ingredient.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Check if multiple ingredients exist
   * @param ids - Array of ingredient IDs
   * @returns Array of IDs that don't exist
   */
  async findNonExistentIds(ids: string[]): Promise<string[]> {
    const existingIngredients = await this.prisma.ingredient.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
      },
    });

    const existingIds = new Set(existingIngredients.map((i) => i.id));
    return ids.filter((id) => !existingIds.has(id));
  }
}
