import React from 'react';
import Residence from './Residence';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('renders Residence page', () => {
    render(
        <BrowserRouter>
          <Residence />
        </BrowserRouter>
      );
});
