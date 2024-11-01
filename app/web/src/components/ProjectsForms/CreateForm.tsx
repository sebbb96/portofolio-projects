import React from 'react';
import { useCreateProjectMutation } from '@/store/services/projectsApi';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, "Description can't be longer than 1000 characters"),
  clientLink: z.string().url('Client link must be a valid URL'),
  status: z.enum(['hidden', 'visible']),
  image: z.any().refine((file) => {
    if (!file) return false;
    return true; // Add more specific file validation if needed
  }, 'Image is required'),
});

function CreateProjectForm() {
  const [createProject, { isLoading, isSuccess, isError }] =
    useCreateProjectMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      clientLink: '',
      status: undefined,
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('clientLink', values.clientLink);
      formData.append('status', values.status);

      // Get the actual file from the input element
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];

      if (file) {
        formData.append('image', file);
      }

      // Debug logging
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      createProject(formData)
        .unwrap()
        .then(() => {
          form.reset(); // Reset form after successful submission
          alert('Project created successfully!');
        })
        .catch((error) => {
          console.error('Failed to create project:', error);
          alert('Failed to create project');
        });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-100 grid gap-4 lg:grid-cols-2 md:grid-cols-1   border p-4"
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" {...field} placeholder="Title" />
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
                  {...field}
                  name="description"
                  placeholder="Description"
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
                <Input
                  {...field}
                  type="url"
                  name="clientLink"
                  placeholder="Client Link"
                />
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
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name="status"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="visible">Visible</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
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
        <Button
          className="lg:col-span-2 md:col-span-1 "
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Project'}
        </Button>
        {isSuccess && (
          <p className="text-green-500">Project created successfully!</p>
        )}
        {isError && <p className="text-red-500">Error creating project.</p>}
      </form>
    </Form>
  );
}

export default CreateProjectForm;
