import {
  CreateProjectBody,
  UpdateProjectBody,
} from '@/types/project.interfaces';
import api from '../config';

const projectController = {
  getProjects: async function () {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (e: unknown) {
      throw new Error(e as string);
    }
  },
  createProject: async function (body: CreateProjectBody) {
    try {
      const response = await api.post('/projects-create	', body);
      return response.data;
    } catch (e: unknown) {
      throw new Error(e as string);
    }
  },
  updateProject: async function (id: string, body: UpdateProjectBody) {
    try {
      const response = await api.put(`/projects-update/${id}`, body);
      return response.data;
    } catch (e: unknown) {
      throw new Error(e as string);
    }
  },
  deleteProject: async function (id: string) {
    try {
      const response = await api.delete(`/projects-delete/${id}`);
      return response.data;
    } catch (e: unknown) {
      throw new Error(e as string);
    }
  },
};

export default projectController;
