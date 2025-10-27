import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { UPLOAD_DIR } from '../config/multer.config';

/**
 * UploadService handles file upload operations and cleanup
 */
@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  /**
   * Get the URL path for an uploaded file
   * @param filename - The filename of the uploaded file
   * @returns The URL path to access the file
   */
  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  /**
   * Delete a file from the uploads directory
   * @param filename - The filename to delete
   * @returns Promise<boolean> - true if deleted, false if file didn't exist
   */
  async deleteFile(filename: string): Promise<boolean> {
    if (!filename) {
      this.logger.warn('Attempted to delete file with empty filename');
      return false;
    }

    // Extract filename from URL if full URL is provided
    const actualFilename = filename.includes('/uploads/')
      ? filename.split('/uploads/')[1]
      : filename;

    const filePath = join(UPLOAD_DIR, actualFilename);

    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
        this.logger.log(`Successfully deleted file: ${actualFilename}`);
        return true;
      } else {
        this.logger.warn(`File not found for deletion: ${actualFilename}`);
        return false;
      }
    } catch (error) {
      this.logger.error(
        `Error deleting file ${actualFilename}: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }

  /**
   * Delete a file only if it's a local upload (not an external URL)
   * @param imageUrl - The image URL (can be local upload or external URL)
   * @returns Promise<boolean> - true if deleted, false otherwise
   */
  async deleteFileIfLocal(imageUrl: string | null): Promise<boolean> {
    if (!imageUrl) {
      return false;
    }

    // Only delete if it's a local upload path
    if (imageUrl.startsWith('/uploads/')) {
      return await this.deleteFile(imageUrl);
    }

    // External URL - don't delete
    this.logger.debug(`Skipping deletion of external URL: ${imageUrl}`);
    return false;
  }

  /**
   * Check if a file exists in the uploads directory
   * @param filename - The filename to check
   * @returns boolean - true if file exists, false otherwise
   */
  fileExists(filename: string): boolean {
    const filePath = join(UPLOAD_DIR, filename);
    return existsSync(filePath);
  }

  /**
   * Get the full file path for a filename
   * @param filename - The filename
   * @returns The full file path
   */
  getFilePath(filename: string): string {
    return join(UPLOAD_DIR, filename);
  }
}
