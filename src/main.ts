import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap the NestJS application
 * - Configures global validation pipe
 * - Sets up Swagger/OpenAPI documentation
 * - Enables CORS
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for cross-origin requests
  app.enableCors();

  // Global validation pipe for automatic DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );

  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Cocktails REST API')
    .setDescription(
      'REST API for managing cocktails and ingredients. ' +
        'This API allows you to create, read, update, and delete cocktails and their ingredients. ' +
        'Features include filtering, sorting, pagination, and image uploads. ' +
        '\n\n**Important:** When creating a cocktail, at least one ingredient with amount is required!',
    )
    .setVersion('1.0')
    .addTag('Cocktails', 'Endpoints for managing cocktails')
    .addTag('Ingredients', 'Endpoints for managing ingredients')
    .addTag('Upload', 'Endpoints for uploading images')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Cocktails API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`
Cocktails REST API is running!

Server:       http://localhost:${port}
Swagger Docs: http://localhost:${port}/api/docs
  `);
}

bootstrap();
