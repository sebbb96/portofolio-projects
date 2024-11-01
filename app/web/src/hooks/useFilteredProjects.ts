import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { IProjects } from '@/types/project.interfaces';
import { useLocation } from 'react-router-dom';

export function useFilteredProjects(projects: IProjects[] | undefined) {
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const location = useLocation();

  if (!projects) return [];

  let filteredProjects = projects;

  // Only show visible projects on the main page
  if (location.pathname === '/') {
    filteredProjects = projects.filter(
      (project) => project.status === 'visible'
    );
  }

  // Apply search filter
  return filteredProjects.filter((project) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower)
    );
  });
}
