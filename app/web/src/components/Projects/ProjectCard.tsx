import { Card } from '@/components/ui/card';
import ProjectDetails from './ProjectDetails';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLocation } from 'react-router-dom';

interface ProjectCardProps {
  id: string;
  title: string;
  image: string;
  clientLink: string;
  description: string;
  status: 'hidden' | 'visible' | undefined;
  onStatusToggle?: () => void;
  onDelete?: (id: string) => void;
  isLoadingDelete?: boolean | undefined;
}

export function ProjectCard({
  id,
  title,
  image,
  clientLink,
  description,
  status,
  onStatusToggle,
  onDelete,
  isLoadingDelete,
}: ProjectCardProps) {
  const location = useLocation();
  return (
    <Card
      className={`${location.pathname === '/editprojects' ? '' : status} group relative h-[200px] w-[300px] overflow-hidden`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <Badge
        className={`${location.pathname === '/editprojects' ? 'absolute top-2 right-2' : 'hidden'}`}
        variant="destructive"
      >
        {status}
      </Badge>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
          <h3 className="text-white text-xl font-bold text-center">{title}</h3>

          <div className="flex gap-2">
            <button
              onClick={onStatusToggle}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors"
            >
              {status === 'visible' ? 'Hide' : 'Show'}
            </button>

            <Button className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors">
              <ProjectDetails
                id={id}
                onDelete={onDelete}
                isLoadingDelete={isLoadingDelete}
                title={title}
                image={image}
                clientLink={clientLink}
                description={description}
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
