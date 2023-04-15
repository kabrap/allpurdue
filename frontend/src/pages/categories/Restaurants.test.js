import React from 'react';
import Restaurants from './Restaurants';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Restaurants page', () => {
    render(
        <BrowserRouter>
          <Restaurants />
        </BrowserRouter>
      );
});
