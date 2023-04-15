import React from 'react';
import Contact from './Contact';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Contact page', () => {
    render(
        <BrowserRouter>
          <Contact />
        </BrowserRouter>
      );
});
