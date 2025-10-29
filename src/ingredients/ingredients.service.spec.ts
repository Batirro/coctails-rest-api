import { Test, TestingModule } from '@nestjs/testing';
import { IngredientsService } from './ingredients.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let prismaService: PrismaService;
  let uploadService: UploadService;

  const mockPrismaService = {
    ingredient: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    cocktailIngredient: {
      count: jest.fn(),
    },
  };

  const mockUploadService = {
    deleteFileIfLocal: jest.fn(),
  };

  const mockIngredient = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'White Rum',
    description: 'A light-bodied rum commonly used in cocktails',
    isAlcoholic: true,
    imageUrl: '/uploads/rum.jpg',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
    prismaService = module.get<PrismaService>(PrismaService);
    uploadService = module.get<UploadService>(UploadService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new ingredient', async () => {
      const createIngredientDto = {
        name: 'White Rum',
        description: 'A light-bodied rum commonly used in cocktails',
        isAlcoholic: true,
        imageUrl: '/uploads/rum.jpg',
      };

      mockPrismaService.ingredient.create.mockResolvedValue(mockIngredient);

      const result = await service.create(createIngredientDto);

      expect(result).toEqual(mockIngredient);
      expect(mockPrismaService.ingredient.create).toHaveBeenCalledWith({
        data: createIngredientDto,
      });
      expect(mockPrismaService.ingredient.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of ingredients', async () => {
      const query = {
        sortBy: 'name' as any,
        sortOrder: 'asc' as any,
        offset: 0,
        limit: 10,
      };

      mockPrismaService.ingredient.count.mockResolvedValue(1);
      mockPrismaService.ingredient.findMany.mockResolvedValue([mockIngredient]);

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockIngredient],
        meta: {
          total: 1,
          offset: 0,
          limit: 10,
        },
      });
      expect(mockPrismaService.ingredient.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.ingredient.findMany).toHaveBeenCalledTimes(1);
    });

    it('should filter by isAlcoholic', async () => {
      const query = {
        isAlcoholic: true,
        sortBy: 'name' as any,
        sortOrder: 'asc' as any,
        offset: 0,
        limit: 10,
      };

      mockPrismaService.ingredient.count.mockResolvedValue(1);
      mockPrismaService.ingredient.findMany.mockResolvedValue([mockIngredient]);

      await service.findAll(query);

      expect(mockPrismaService.ingredient.findMany).toHaveBeenCalledWith({
        where: { isAlcoholic: true },
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
      });
    });

    it('should filter by search term', async () => {
      const query = {
        search: 'rum',
        sortBy: 'name' as any,
        sortOrder: 'asc' as any,
        offset: 0,
        limit: 10,
      };

      mockPrismaService.ingredient.count.mockResolvedValue(1);
      mockPrismaService.ingredient.findMany.mockResolvedValue([mockIngredient]);

      await service.findAll(query);

      expect(mockPrismaService.ingredient.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'rum',
            mode: 'insensitive',
          },
        },
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return an ingredient by id', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockIngredient);
      expect(mockPrismaService.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('should throw NotFoundException if ingredient not found', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findOne('non-existent-id'),
      ).rejects.toThrow('Ingredient with id non-existent-id not found');
    });
  });

  describe('update', () => {
    it('should update an ingredient', async () => {
      const updateDto = {
        name: 'Dark Rum',
        description: 'Updated description',
      };

      const updatedIngredient = {
        ...mockIngredient,
        ...updateDto,
      };

      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);
      mockPrismaService.ingredient.update.mockResolvedValue(updatedIngredient);

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateDto);

      expect(result).toEqual(updatedIngredient);
      expect(mockPrismaService.ingredient.update).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if ingredient not found', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an ingredient not used in cocktails', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);
      mockPrismaService.cocktailIngredient.count.mockResolvedValue(0);
      mockPrismaService.ingredient.delete.mockResolvedValue(mockIngredient);
      mockUploadService.deleteFileIfLocal.mockResolvedValue(true);

      const result = await service.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual({ message: 'Ingredient successfully deleted' });
      expect(mockPrismaService.ingredient.delete).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
      expect(mockUploadService.deleteFileIfLocal).toHaveBeenCalledWith('/uploads/rum.jpg');
    });

    it('should throw ConflictException if ingredient is used in cocktails', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(mockIngredient);
      mockPrismaService.cocktailIngredient.count.mockResolvedValue(3);

      await expect(
        service.remove('123e4567-e89b-12d3-a456-426614174000'),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.remove('123e4567-e89b-12d3-a456-426614174000'),
      ).rejects.toThrow('Cannot delete ingredient. It is used in 3 cocktail(s)');

      expect(mockPrismaService.ingredient.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if ingredient not found', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(null);

      await expect(
        service.remove('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('exists', () => {
    it('should return true if ingredient exists', async () => {
      mockPrismaService.ingredient.count.mockResolvedValue(1);

      const result = await service.exists('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toBe(true);
    });

    it('should return false if ingredient does not exist', async () => {
      mockPrismaService.ingredient.count.mockResolvedValue(0);

      const result = await service.exists('non-existent-id');

      expect(result).toBe(false);
    });
  });

  describe('findNonExistentIds', () => {
    it('should return empty array if all ingredients exist', async () => {
      const ids = ['id1', 'id2', 'id3'];
      mockPrismaService.ingredient.findMany.mockResolvedValue([
        { id: 'id1' },
        { id: 'id2' },
        { id: 'id3' },
      ]);

      const result = await service.findNonExistentIds(ids);

      expect(result).toEqual([]);
    });

    it('should return non-existent ingredient IDs', async () => {
      const ids = ['id1', 'id2', 'id3'];
      mockPrismaService.ingredient.findMany.mockResolvedValue([
        { id: 'id1' },
        { id: 'id3' },
      ]);

      const result = await service.findNonExistentIds(ids);

      expect(result).toEqual(['id2']);
    });

    it('should return all IDs if none exist', async () => {
      const ids = ['id1', 'id2', 'id3'];
      mockPrismaService.ingredient.findMany.mockResolvedValue([]);

      const result = await service.findNonExistentIds(ids);

      expect(result).toEqual(['id1', 'id2', 'id3']);
    });
  });
});
