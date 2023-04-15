import React from 'react';
import Dashboard from './Dashboard';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Dashboard page', () => {
    render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
});
