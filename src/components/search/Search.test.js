import React from 'react';
import Search from './Search';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Search component', () => {
    render(
        <BrowserRouter>
          <Search />
        </BrowserRouter>
      );
});
