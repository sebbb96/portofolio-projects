import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { HttpException } from '@nestjs/common';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProjects = [
    {
      id: 1,
      title: 'Test Project',
      description: 'Test Description',
      clientLink: 'https://test.com',
      status: 'visible' as const,
      image: 'test.jpg',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockProjects),
            create: jest.fn().mockImplementation((dto) => ({
              id: Date.now(),
              ...dto,
            })),
            update: jest.fn().mockImplementation((id, dto) => ({
              id,
              ...dto,
            })),
            delete: jest.fn().mockImplementation((id) => ({
              id,
              ...mockProjects[0],
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      expect(await controller.findAll()).toBe(mockProjects);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a project', async () => {
      const file = {
        filename: 'test.jpg',
      } as Express.Multer.File;

      const dto = {
        title: 'New Project',
        description: 'New Description',
        clientLink: 'https://test.com',
        status: 'visible' as const,
        image: file.filename,
      };

      const result = await controller.create(dto, file);
      expect(result).toHaveProperty('id');
      expect(service.create).toHaveBeenCalled();
    });

    it('should throw error if no file is provided', async () => {
      const dto = {
        title: 'New Project',
        description: 'New Description',
        clientLink: 'https://test.com',
        status: 'visible' as const,
        image: 'dummy.jpg',
      };

      await expect(controller.create(dto, null)).rejects.toThrow(
        new HttpException('File not uploaded', 400),
      );
    });
  });
});
