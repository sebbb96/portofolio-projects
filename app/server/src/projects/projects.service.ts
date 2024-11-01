import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateProjectDto } from './dto/update-project.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class ProjectsService {
  private readonly projectsPath = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'projects.json',
  );
  private readProjects() {
    const data = fs.readFileSync(this.projectsPath, 'utf8');
    return JSON.parse(data);
  }
  private writeProjects(projects: any[]) {
    fs.writeFileSync(this.projectsPath, JSON.stringify(projects, null, 2));
  }
  findAll() {
    return this.readProjects();
  }
  create(createProjectDto: CreateProjectDto) {
    const projects = this.findAll();
    const newProjects = { id: Date.now(), ...createProjectDto };
    projects.push(newProjects);
    fs.writeFileSync(this.projectsPath, JSON.stringify(projects, null, 2));
    return newProjects;
  }
  async update(id: number, updateProjectDto: Partial<UpdateProjectDto>) {
    const projects = this.readProjects();
    const index = projects.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      throw new HttpException(
        `Project with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Only update fields that are provided
    const updatedProject = {
      ...projects[index],
      ...Object.entries(updateProjectDto).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {}),
    };
    console.log('UPDATED PROJECT', updatedProject);
    projects[index] = updatedProject;
    this.writeProjects(projects);

    return updatedProject;
  }
  delete(id: number) {
    const projects = this.findAll();
    const projectIndex = projects.findIndex(
      (project) => project.id === Number(id),
    );

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const [deletedProject] = projects.splice(projectIndex, 1);

    // Delete the image file if it exists
    if (deletedProject.image) {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        path.basename(deletedProject.image),
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    fs.writeFileSync(this.projectsPath, JSON.stringify(projects, null, 2));
    return deletedProject;
  }
}
