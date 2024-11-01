import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('ProjectsService', () => {
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
      providers: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);

    // Mock fs methods
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(mockProjects),
    );
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (path.join as jest.Mock).mockReturnValue('./test/path/projects.json');
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
      const result = service.delete(1);
      expect(result).toEqual(mockProjects[0]);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should throw error if project not found', async () => {
      expect(() => service.delete(999)).toThrow('Project not found');
    });
  });
});
