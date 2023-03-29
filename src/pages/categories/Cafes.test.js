import React from 'react';
import Cafes from './Cafes';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Cafes page', () => {
    render(
        <BrowserRouter>
          <Cafes />
        </BrowserRouter>
      );
});
