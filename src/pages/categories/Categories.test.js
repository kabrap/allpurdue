import React from 'react';
import Categories from './Categories';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Categories page', () => {
    render(
        <BrowserRouter>
          <Categories />
        </BrowserRouter>
      );
});
