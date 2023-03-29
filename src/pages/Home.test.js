import { render, screen } from '@testing-library/react';
import Home from './Home';
import '@testing-library/jest-dom';

describe('Home component', () => {
  test('renders hero heading', () => {
    render(<Home />);
    const headingElement = screen.getByText(/Find all the best places at/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders recent reviews section', () => {
    render(<Home />);
    const reviewsElement = screen.getByText(/Recent Reviews/i);
    expect(reviewsElement).toBeInTheDocument();
  });

  test('renders recent blogs section', () => {
    render(<Home />);
    const blogsElement = screen.getByText(/Explore recent/i);
    expect(blogsElement).toBeInTheDocument();
  });
});
