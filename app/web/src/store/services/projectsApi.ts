import { IProjects } from '@/types/project.interfaces';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  tagTypes: ['Projects'],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => '/projects',
      providesTags: ['Projects'],
    }),
    createProject: builder.mutation({
      query: (formData) => ({
        url: '/projects-create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Projects'],
    }),
    updateProject: builder.mutation<
      IProjects,
      { id: string | number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/projects-update/${id}`,
        method: 'PUT',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Projects'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects-delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
