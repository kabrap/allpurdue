import React from 'react';
import BlogCreationPage from './BlogCreationPage';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders BlogCreationPage page', () => {
    render(
        <BrowserRouter>
          <BlogCreationPage />
        </BrowserRouter>
      );
});
