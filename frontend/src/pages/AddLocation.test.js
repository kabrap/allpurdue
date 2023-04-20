import React from 'react';
import AddLocation from './AddLocation';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders AddLocation page', () => {
    render(
        <BrowserRouter>
          <AddLocation />
        </BrowserRouter>
      );
});
