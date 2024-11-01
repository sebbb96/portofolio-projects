import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

describe('ProjectCard', () => {
  const mockProps = {
    id: '1',
    title: 'Test Project',
    image: 'test.jpg',
    clientLink: 'https://test.com',
    description: 'Test Description',
    status: 'visible' as const,
  };

  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders project title', () => {
    renderWithRouter(<ProjectCard {...mockProps} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('calls onStatusToggle when status button is clicked', () => {
    const onStatusToggle = vi.fn();
    renderWithRouter(
      <ProjectCard {...mockProps} onStatusToggle={onStatusToggle} />
    );

    const statusButton = screen.getByText('Hide');
    fireEvent.click(statusButton);
    expect(onStatusToggle).toHaveBeenCalled();
  });

  it('shows status badge on edit page', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProjectCard {...mockProps} />
      </BrowserRouter>
    );

    const statusElement = getByText(mockProps.status);
    expect(statusElement).toBeInTheDocument();
  });
});
