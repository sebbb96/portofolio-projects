import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil2Icon, ReloadIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { IProjects } from '@/types/project.interfaces';
import { useLocation } from 'react-router-dom';
import { EditProjectForm } from './EditProjectForm';

export default function ProjectDetails(props: IProjects) {
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div>
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent className="h-[85vh]">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 h-full flex flex-col">
            <DrawerHeader>
              <DrawerTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-center">
                <p>{props.title}</p>
                {location.pathname === '/editprojects' && (
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                    <Pencil2Icon className="w-4 h-4" /> Edit
                  </Button>
                )}
              </DrawerTitle>
            </DrawerHeader>

            {/* Project Details View */}
            {!isEditMode && (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Image container */}
                    <div className="aspect-video lg:aspect-square w-full relative rounded-lg">
                      <img
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        src={props.image}
                        alt="project img"
                      />
                    </div>

                    {/* Description container */}
                    <div className="w-full">
                      <DrawerDescription className="text-sm break-words whitespace-pre-wrap sm:text-base max-w-full">
                        <p> {props.description}</p>
                      </DrawerDescription>
                    </div>
                  </div>
                </div>

                <DrawerFooter className="mt-auto">
                  <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 p-2 justify-center">
                    <Button
                      className="w-full sm:w-auto"
                      disabled={props.isLoadingDelete}
                      asChild
                    >
                      <a
                        href={props.clientLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        See Project
                      </a>
                    </Button>

                    <DrawerClose className="w-full sm:w-auto">
                      <Button
                        className="w-full"
                        disabled={props.isLoadingDelete}
                      >
                        Close
                      </Button>
                    </DrawerClose>

                    {location.pathname === '/editprojects' && (
                      <Button
                        className="w-full sm:w-auto"
                        onClick={() => props.onDelete?.(props.id)}
                        variant="destructive"
                        disabled={props.isLoadingDelete}
                      >
                        {props.isLoadingDelete ? (
                          <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete Project'
                        )}
                      </Button>
                    )}
                  </div>
                </DrawerFooter>
              </>
            )}

            {/* Edit Form Dialog */}
            <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <EditProjectForm
                  project={props}
                  onSuccess={() => setIsEditMode(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
