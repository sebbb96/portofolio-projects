import { useUpdateProjectMutation } from '@/store/services/projectsApi';
import { IProjects } from '@/types/project.interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Make all fields optional for updates
const formSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(1000).optional(),
  clientLink: z.string().url().optional(),
  status: z.enum(['hidden', 'visible']).optional(),
  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true; // Allow empty file
        if (file instanceof File) {
          return [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
          ].includes(file.type);
        }
        return true;
      },
      {
        message: 'File must be a valid image (jpg, jpeg, png, or webp)',
      }
    ),
});

interface EditProjectFormProps {
  project: IProjects;
  onSuccess: () => void;
}

export function EditProjectForm({ project, onSuccess }: EditProjectFormProps) {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      clientLink: project.clientLink,
      status: project.status,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted with values:', values);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          console.log(`Adding to FormData: ${key}:`, value);
          if (value instanceof File) {
            formData.append(key, value);
          } else if (typeof value === 'string' && value.trim() !== '') {
            formData.append(key, value);
          }
        }
      });

      console.log('About to call updateProject');
      const result = await updateProject({
        id: project.id,
        formData: formData,
      }).unwrap();
      console.log('updateProject result:', result);

      onSuccess();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  }

  return (
    <Form {...form}>
      <form
        data-testid="edit-project-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Update title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Update description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Link</FormLabel>
              <FormControl>
                <Input placeholder="Update client link" type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hidden">Hidden</SelectItem>
                  <SelectItem value="visible">Visible</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
