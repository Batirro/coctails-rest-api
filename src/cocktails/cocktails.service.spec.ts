import { Test, TestingModule } from '@nestjs/testing';
import { CocktailsService } from './cocktails.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CocktailCategory } from '../common/enums/cocktail-category.enum';

describe('CocktailsService', () => {
  let service: CocktailsService;
  let prismaService: PrismaService;
  let uploadService: UploadService;
  let ingredientsService: IngredientsService;

  const mockPrismaService = {
    cocktail: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockUploadService = {
    deleteFileIfLocal: jest.fn(),
  };

  const mockIngredientsService = {
    findNonExistentIds: jest.fn(),
  };

  const mockCocktail = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Mojito',
    category: CocktailCategory.CLASSIC,
    instructions: 'Muddle mint leaves with sugar and lime juice...',
    imageUrl: '/uploads/mojito.jpg',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    ingredients: [
      {
        ingredientId: 'ing1',
        amount: '50ml',
        ingredient: {
          id: 'ing1',
          name: 'White Rum',
          description: 'Light rum',
          isAlcoholic: true,
          imageUrl: null,
        },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CocktailsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
        {
          provide: IngredientsService,
          useValue: mockIngredientsService,
        },
      ],
    }).compile();

    service = module.get<CocktailsService>(CocktailsService);
    prismaService = module.get<PrismaService>(PrismaService);
    uploadService = module.get<UploadService>(UploadService);
    ingredientsService = module.get<IngredientsService>(IngredientsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new cocktail with ingredients', async () => {
      const createCocktailDto = {
        name: 'Mojito',
        category: CocktailCategory.CLASSIC,
        instructions: 'Muddle mint leaves with sugar and lime juice...',
        imageUrl: '/uploads/mojito.jpg',
        ingredients: [
          {
            ingredientId: 'ing1',
            amount: '50ml',
          },
          {
            ingredientId: 'ing2',
            amount: '10 leaves',
          },
        ],
      };

      mockIngredientsService.findNonExistentIds.mockResolvedValue([]);
      mockPrismaService.cocktail.create.mockResolvedValue(mockCocktail);

      const result = await service.create(createCocktailDto);

      expect(result).toEqual(mockCocktail);
      expect(mockIngredientsService.findNonExistentIds).toHaveBeenCalledWith([
        'ing1',
        'ing2',
      ]);
      expect(mockPrismaService.cocktail.create).toHaveBeenCalledWith({
        data: {
          name: createCocktailDto.name,
          category: createCocktailDto.category,
          instructions: createCocktailDto.instructions,
          imageUrl: createCocktailDto.imageUrl,
          ingredients: {
            create: [
              { ingredientId: 'ing1', amount: '50ml' },
              { ingredientId: 'ing2', amount: '10 leaves' },
            ],
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
    });

    it('should throw BadRequestException if ingredient IDs do not exist', async () => {
      const createCocktailDto = {
        name: 'Mojito',
        category: CocktailCategory.CLASSIC,
        instructions: 'Muddle mint leaves...',
        ingredients: [
          {
            ingredientId: 'non-existent-id',
            amount: '50ml',
          },
        ],
      };

      mockIngredientsService.findNonExistentIds.mockResolvedValue([
        'non-existent-id',
      ]);

      await expect(service.create(createCocktailDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createCocktailDto)).rejects.toThrow(
        'The following ingredient IDs do not exist: non-existent-id',
      );

      expect(mockPrismaService.cocktail.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated list of cocktails', async () => {
      const query = {
        sortBy: 'name' as any,
        sortOrder: 'asc' as any,
        offset: 0,
        limit: 10,
      };

      mockPrismaService.cocktail.count.mockResolvedValue(1);
      mockPrismaService.cocktail.findMany.mockResolvedValue([mockCocktail]);

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockCocktail],
        meta: {
          total: 1,
          offset: 0,
          limit: 10,
        },
      });
      expect(mockPrismaService.cocktail.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.cocktail.findMany).toHaveBeenCalledTimes(1);
    });

    it('should filter by category', async () => {
      const query = {
        category: CocktailCategory.TROPICAL,
        sortBy: 'name' as any,
        sortOrder: 'asc' as any,
        offset: 0,
        limit: 10,
      };

      mockPrismaService.cocktail.count.mockResolvedValue(1);
      mockPrismaService.cocktail.findMany.mockResolvedValue([mockCocktail]);

      await service.findAll(query);

      expect(mockPrismaService.cocktail.findMany).toHaveBeenCalledWith({
        where: { category: CocktailCategory.TROPICAL },
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    it('should filter by ingredientId', async () => {
      const query = {
        ingredientId: 'ing1',
        sortBy: 'name' as any,
        sortOrder: 'asc' as any,
        offset: 0,
        limit: 10,
      };

      mockPrismaService.cocktail.count.mockResolvedValue(1);
      mockPrismaService.cocktail.findMany.mockResolvedValue([mockCocktail]);

      await service.findAll(query);

      expect(mockPrismaService.cocktail.findMany).toHaveBeenCalledWith({
        where: {
          ingredients: {
            some: {
              ingredientId: 'ing1',
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    it('should filter for non-alcoholic cocktails', async () => {
      const query = {
        nonAlcoholic: true,
        sortBy: 'name' as any,
        sortOrder: 'asc' as any,
        offset: 0,
        limit: 10,
      };

      mockPrismaService.cocktail.count.mockResolvedValue(1);
      mockPrismaService.cocktail.findMany.mockResolvedValue([mockCocktail]);

      await service.findAll(query);

      expect(mockPrismaService.cocktail.findMany).toHaveBeenCalledWith({
        where: {
          ingredients: {
            every: {
              ingredient: {
                isAlcoholic: false,
              },
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a cocktail by id', async () => {
      mockPrismaService.cocktail.findUnique.mockResolvedValue(mockCocktail);

      const result = await service.findOne(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result).toEqual(mockCocktail);
      expect(mockPrismaService.cocktail.findUnique).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if cocktail not found', async () => {
      mockPrismaService.cocktail.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Cocktail with id non-existent-id not found',
      );
    });
  });

  describe('update', () => {
    it('should update a cocktail without changing ingredients', async () => {
      const updateDto = {
        name: 'Mojito Deluxe',
        instructions: 'Updated instructions',
      };

      const updatedCocktail = {
        ...mockCocktail,
        ...updateDto,
      };

      mockPrismaService.cocktail.findUnique.mockResolvedValue(mockCocktail);
      mockPrismaService.cocktail.update.mockResolvedValue(updatedCocktail);

      const result = await service.update(
        '123e4567-e89b-12d3-a456-426614174000',
        updateDto,
      );

      expect(result).toEqual(updatedCocktail);
      expect(mockPrismaService.cocktail.update).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        data: {
          name: 'Mojito Deluxe',
          instructions: 'Updated instructions',
          category: undefined,
          imageUrl: undefined,
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    it('should update cocktail and replace ingredients', async () => {
      const updateDto = {
        name: 'Mojito Deluxe',
        ingredients: [
          {
            ingredientId: 'new-ing-1',
            amount: '60ml',
          },
        ],
      };

      mockPrismaService.cocktail.findUnique.mockResolvedValue(mockCocktail);
      mockIngredientsService.findNonExistentIds.mockResolvedValue([]);
      mockPrismaService.cocktail.update.mockResolvedValue({
        ...mockCocktail,
        name: 'Mojito Deluxe',
      });

      const result = await service.update(
        '123e4567-e89b-12d3-a456-426614174000',
        updateDto,
      );

      expect(mockIngredientsService.findNonExistentIds).toHaveBeenCalledWith([
        'new-ing-1',
      ]);
      expect(mockPrismaService.cocktail.update).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        data: {
          name: 'Mojito Deluxe',
          category: undefined,
          instructions: undefined,
          imageUrl: undefined,
          ingredients: {
            deleteMany: {},
            create: [{ ingredientId: 'new-ing-1', amount: '60ml' }],
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
    });

    it('should throw BadRequestException if ingredient IDs do not exist', async () => {
      const updateDto = {
        ingredients: [
          {
            ingredientId: 'non-existent-id',
            amount: '50ml',
          },
        ],
      };

      mockPrismaService.cocktail.findUnique.mockResolvedValue(mockCocktail);
      mockIngredientsService.findNonExistentIds.mockResolvedValue([
        'non-existent-id',
      ]);

      await expect(
        service.update('123e4567-e89b-12d3-a456-426614174000', updateDto),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrismaService.cocktail.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if cocktail not found', async () => {
      mockPrismaService.cocktail.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a cocktail and its uploaded image', async () => {
      mockPrismaService.cocktail.findUnique.mockResolvedValue(mockCocktail);
      mockPrismaService.cocktail.delete.mockResolvedValue(mockCocktail);
      mockUploadService.deleteFileIfLocal.mockResolvedValue(true);

      const result = await service.remove(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result).toEqual({ message: 'Cocktail successfully deleted' });
      expect(mockPrismaService.cocktail.delete).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
      expect(mockUploadService.deleteFileIfLocal).toHaveBeenCalledWith(
        '/uploads/mojito.jpg',
      );
    });

    it('should throw NotFoundException if cocktail not found', async () => {
      mockPrismaService.cocktail.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
