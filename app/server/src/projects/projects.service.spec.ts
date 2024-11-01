import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('ProjectsService', () => {
  let service: ProjectsService;
  let mockProjects: any[];

  beforeEach(async () => {
    // Reset mock data before each test
    mockProjects = [
      {
        id: 1,
        title: 'Test Project',
        description: 'Test Description',
        clientLink: 'https://test.com',
        status: 'visible' as const,
        image: 'test.jpg',
      },
    ];

    // Clear all mocks
    jest.clearAllMocks();

    // Setup mock implementations
    (fs.readFileSync as jest.Mock).mockImplementation(() =>
      JSON.stringify(mockProjects),
    );

    (fs.writeFileSync as jest.Mock).mockImplementation((path, data) => {
      mockProjects = JSON.parse(data);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of projects', async () => {
      const result = service.findAll();
      expect(result).toEqual(mockProjects);
      expect(fs.readFileSync).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const newProject = {
        title: 'New Project',
        description: 'New Description',
        clientLink: 'https://new.com',
        status: 'visible' as const,
        image: 'new.jpg',
      };

      const result = service.create(newProject);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe(newProject.title);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing project', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      const result = await service.update(1, updateData);
      expect(result.title).toBe(updateData.title);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should throw error if project not found', async () => {
      await expect(service.update(999, { title: 'Test' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a project', async () => {
      // Store the project before deletion for comparison
      const projectToDelete = { ...mockProjects[0] };

      const result = service.delete(1);
      expect(result).toEqual(projectToDelete);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should throw error if project not found', async () => {
      expect(() => service.delete(999)).toThrow('Project not found');
    });
  });
});
