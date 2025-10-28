import { Module } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';
import { UploadModule } from '../upload/upload.module';
import { IngredientsModule } from '../ingredients/ingredients.module';

/**
 * CocktailsModule handles all cocktail-related functionality
 * Provides CRUD operations, filtering, sorting, and pagination for cocktails
 * Manages relationships between cocktails and ingredients
 */
@Module({
  imports: [UploadModule, IngredientsModule],
  controllers: [CocktailsController],
  providers: [CocktailsService],
  exports: [CocktailsService],
})
export class CocktailsModule {}
