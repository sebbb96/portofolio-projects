import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  // ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { extname } from 'path';
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get('projects')
  findAll() {
    return this.projectsService.findAll();
  }
  @Post('/projects-create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return callback(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      console.log('Received file:', file);
      console.log('Received DTO:', createProjectDto);

      if (!file) {
        throw new HttpException('File not uploaded', HttpStatus.BAD_REQUEST);
      }

      const imageUrl = `http://localhost:3000/uploads/${file.filename}`;

      const project = await this.projectsService.create({
        ...createProjectDto,
        image: imageUrl,
      });

      return project;
    } catch (error) {
      console.error('Error in create:', error);
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put('/projects-update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      console.log('Received update data:', {
        id,
        dto: updateProjectDto,
        file: file ? 'File received' : 'No file',
      });

      // Create update object with only defined values
      const updateData: Partial<UpdateProjectDto> = {};

      // Only add properties that exist in the DTO
      if (updateProjectDto.title) updateData.title = updateProjectDto.title;
      if (updateProjectDto.description)
        updateData.description = updateProjectDto.description;
      if (updateProjectDto.clientLink)
        updateData.clientLink = updateProjectDto.clientLink;
      if (updateProjectDto.status) updateData.status = updateProjectDto.status;

      // Handle file upload
      if (file) {
        updateData.image = `http://localhost:3000/uploads/${file.filename}`;
      }

      const updatedProject = await this.projectsService.update(id, updateData);
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw new HttpException(
        error.message || 'Failed to update project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete('/projects-delete/:id')
  async delete(@Param('id') id: number) {
    return this.projectsService.delete(id);
  }
}
