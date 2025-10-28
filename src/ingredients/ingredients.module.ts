import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { UploadModule } from '../upload/upload.module';

/**
 * IngredientsModule handles all ingredient-related functionality
 * Provides CRUD operations, filtering, sorting, and pagination for ingredients
 */
@Module({
  imports: [UploadModule],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [IngredientsService],
})
export class IngredientsModule {}
