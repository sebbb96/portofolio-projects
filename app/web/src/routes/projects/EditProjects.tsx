import { useNavigate, useSearchParams } from 'react-router-dom';
import CreateProjectForm from '@/components/ProjectsForms/CreateForm';
import { ProjectCard } from '@/components/Projects/ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from '@/store/services/projectsApi';
import { IProjects } from '@/types/project.interfaces';
import { useFilteredProjects } from '@/hooks/useFilteredProjects';

function EditProjects() {
  const { data: projects, isLoading, isError } = useGetProjectsQuery({});
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const filteredProjects = useFilteredProjects(projects);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'projects';

  async function handleDelete(id: string) {
    try {
      await deleteProject(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  const handleTabChange = (value: string) => {
    navigate(`/editprojects?tab=${value}`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching projects</p>;

  return (
    <>
      <div className="flex justify-center">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-100 flex flex-col items-center"
        >
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="createproject">Add Project</TabsTrigger>
          </TabsList>
          <TabsContent
            className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4"
            value="projects"
          >
            {projects ? (
              filteredProjects?.map((project: IProjects) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  image={project.image}
                  clientLink={project.clientLink}
                  description={project.description}
                  status={project.status}
                  onDelete={handleDelete}
                  isLoadingDelete={isDeleting}
                  onStatusToggle={() => {
                    const formData = new FormData();
                    formData.append(
                      'status',
                      project.status === 'hidden' ? 'visible' : 'hidden'
                    );
                    updateProject({
                      id: project.id,
                      formData,
                    });
                  }}
                />
              ))
            ) : (
              <p>No Projects added</p>
            )}
          </TabsContent>
          <TabsContent value="createproject">
            <CreateProjectForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default EditProjects;
