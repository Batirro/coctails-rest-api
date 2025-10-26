import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule is a global module that provides PrismaService
 * to all other modules in the application.
 *
 * @Global decorator makes this module available throughout the app
 * without needing to import it in every module.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
