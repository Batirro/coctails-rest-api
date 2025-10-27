import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { BadRequestException } from '@nestjs/common';

describe('UploadController', () => {
  let controller: UploadController;
  let uploadService: UploadService;

  const mockUploadService = {
    getFileUrl: jest.fn(),
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test-image.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024 * 1024, // 1MB
    destination: './uploads',
    filename: '550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg',
    path: './uploads/550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg',
    buffer: Buffer.from(''),
    stream: null,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    uploadService = module.get<UploadService>(UploadService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file and return URL and filename', () => {
      const expectedUrl = '/uploads/550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg';

      mockUploadService.getFileUrl.mockReturnValue(expectedUrl);

      const result = controller.uploadFile(mockFile);

      expect(result).toEqual({
        url: expectedUrl,
        filename: '550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg',
      });
      expect(mockUploadService.getFileUrl).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000-1699564800000.jpg',
      );
    });

    it('should throw BadRequestException if no file is provided', () => {
      expect(() => controller.uploadFile(null)).toThrow(BadRequestException);
      expect(() => controller.uploadFile(null)).toThrow('No file provided');
    });

    it('should throw BadRequestException if file is undefined', () => {
      expect(() => controller.uploadFile(undefined)).toThrow(BadRequestException);
      expect(() => controller.uploadFile(undefined)).toThrow('No file provided');
    });
  });
});
