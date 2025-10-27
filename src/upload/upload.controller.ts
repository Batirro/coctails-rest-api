import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { multerConfig } from '../config/multer.config';
import { UploadService } from './upload.service';

/**
 * UploadController handles file upload operations
 */
@ApiTags('Upload')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload a single image file
   * Accepts only .jpg files up to 5MB
   * Returns the URL path to the uploaded file
   */
  @Post()
  @ApiOperation({
    summary: 'Upload an image file',
    description: 'Upload a single .jpg image file (max 5MB). Returns the URL path to access the uploaded file.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (.jpg only, max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: '/uploads/550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg',
        },
        filename: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type or size',
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): { url: string; filename: string } {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const url = this.uploadService.getFileUrl(file.filename);

    return {
      url,
      filename: file.filename,
    };
  }
}
