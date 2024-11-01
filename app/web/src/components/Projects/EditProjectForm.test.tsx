import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { EditProjectForm } from './EditProjectForm';
import { vi } from 'vitest';
import * as projectsApi from '@/store/services/projectsApi';
// import {  MutationDefinition } from '@reduxjs/toolkit/query';

const mockProject = {
  id: '1',
  title: 'Test Project',
  description: 'Test Description',
  clientLink: 'https://test.com',
  status: 'visible' as const,
  image: 'test.jpg',
};

describe('EditProjectForm', () => {
  const onSuccess = vi.fn();
  const mockUpdateProject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUpdateProject.mockImplementation(() => ({
      unwrap: () => Promise.resolve(mockProject),
    }));

    vi.spyOn(projectsApi, 'useUpdateProjectMutation').mockReturnValue([
      mockUpdateProject,
      {
        isLoading: false,
        isSuccess: true,
        isError: false,
        status: 'fulfilled',
        data: mockProject,
        endpointName: 'updateProject',
        originalArgs: undefined,
        reset: () => {},
        requestId: '',
        startedTimeStamp: 0,
        fulfilledTimeStamp: 0,
      } as const,
    ] as const);

    render(
      <Provider store={store}>
        <EditProjectForm project={mockProject} onSuccess={onSuccess} />
      </Provider>
    );
  });

  it('handles form submission', async () => {
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    const titleInput = screen.getByLabelText(/title/i);

    fireEvent.change(titleInput, { target: { value: 'New Title' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUpdateProject).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('renders with initial values', () => {
    expect(screen.getByDisplayValue(mockProject.title)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockProject.description)
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockProject.clientLink)
    ).toBeInTheDocument();
  });

  it('handles cancel button', () => {
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(onSuccess).toHaveBeenCalled();
  });
});
