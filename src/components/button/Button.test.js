import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from './Button';

test('renders Button component', () => {
    render(
        <BrowserRouter>
          <Button />
        </BrowserRouter>
      );
});
