import React from 'react';
import Study from './Study';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Study page', () => {
    render(
        <BrowserRouter>
          <Study />
        </BrowserRouter>
      );
});
