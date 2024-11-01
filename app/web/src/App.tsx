import { useGetProjectsQuery } from './store/services/projectsApi';
import { ProjectCard } from '@/components/Projects/ProjectCard';
import { IProjects } from '@/types/project.interfaces';
import { useFilteredProjects } from '@/hooks/useFilteredProjects';

function App() {
  const { data: projects, isLoading, isError } = useGetProjectsQuery({});
  const filteredProjects = useFilteredProjects(projects);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching projects</p>;

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map((project: IProjects) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            description={project.description}
            title={project.title}
            image={project.image}
            clientLink={project.clientLink}
            status={project.status}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
