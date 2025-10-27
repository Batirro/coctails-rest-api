import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

/**
 * Maximum file size: 5MB
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed file extensions
 */
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg'];

/**
 * Upload directory path
 */
export const UPLOAD_DIR = './uploads';

/**
 * Ensure upload directory exists
 */
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Multer configuration for file uploads
 * - Validates file type (only .jpg/.jpeg)
 * - Validates file size (max 5MB)
 * - Generates unique filename using UUID
 * - Stores files in ./uploads directory
 */
export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      const fileExtension = extname(file.originalname).toLowerCase();
      const uniqueFilename = `${uuidv4()}-${Date.now()}${fileExtension}`;
      cb(null, uniqueFilename);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const fileExtension = extname(file.originalname).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return cb(
        new BadRequestException(
          `Invalid file type. Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed`,
        ),
        false,
      );
    }

    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
};

/**
 * Helper function to validate file size manually
 * Used when multer's built-in validation might not catch it
 */
export const validateFileSize = (file: Express.Multer.File): void => {
  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestException(
      `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    );
  }
};

/**
 * Helper function to validate file extension manually
 */
export const validateFileExtension = (filename: string): void => {
  const fileExtension = extname(filename).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    throw new BadRequestException(
      `Invalid file type. Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed`,
    );
  }
};
