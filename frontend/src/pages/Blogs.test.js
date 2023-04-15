import React from 'react';
import Blogs from './Blogs';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders blogs page', () => {
    render(
        <BrowserRouter>
          <Blogs />
        </BrowserRouter>
      );
});
