import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService extends PrismaClient and implements lifecycle hooks
 * to manage database connections properly.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Connect to the database when the module initializes
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnect from the database when the module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Helper method to clean database (useful for testing)
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production environment');
    }

    // Delete in correct order due to foreign key constraints
    await this.cocktailIngredient.deleteMany();
    await this.cocktail.deleteMany();
    await this.ingredient.deleteMany();
  }
}
