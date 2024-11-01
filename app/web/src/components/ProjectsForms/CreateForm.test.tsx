import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import CreateProjectForm from './CreateForm';
// import { vi } from 'vitest';

const renderWithProvider = (component: React.ReactNode) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('CreateProjectForm', () => {
  it('renders all form fields', () => {
    renderWithProvider(<CreateProjectForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client link/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText(/image/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProvider(<CreateProjectForm />);

    const submitButton = screen.getByRole('button', {
      name: /create project/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it('handles file upload', () => {
    renderWithProvider(<CreateProjectForm />);

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/image/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(input.files?.[0]).toBe(file);
  });
});
