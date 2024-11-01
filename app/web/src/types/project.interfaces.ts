export interface CreateProjectBody {
  title: string;
  description: string;
  clientLink: string;
  status: 'hidden' | 'visible';
  // The image will be handled separately as a file
}

export interface UpdateProjectBody {
  title?: string;
  description?: string;
  clientLink?: string;
  status?: 'hidden' | 'visible';
  // The image will be handled separately as a file
}
export interface IProjects {
  id: string;
  title: string;
  description: string;
  clientLink: string;
  onDelete?: (id: string) => void | undefined;
  isLoadingDelete?: boolean | undefined;
  status?: 'hidden' | 'visible';
  image: string;
}
