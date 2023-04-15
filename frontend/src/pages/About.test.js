import React from 'react';
import About from './About';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders About page', () => {
    render(
        <BrowserRouter>
          <About />
        </BrowserRouter>
      );
});
