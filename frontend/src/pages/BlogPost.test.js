import React from 'react';
import BlogPost from './BlogPost';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders blog post page', () => {
    render(
        <BrowserRouter>
          <BlogPost />
        </BrowserRouter>
      );
});
