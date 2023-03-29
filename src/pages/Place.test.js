import React from 'react';
import { shallow } from 'enzyme';
import Place from './Place';

describe('Place component', () => {
  const wrapper = shallow(<Place />);
  
  it('should render without errors', () => {
    expect(wrapper.find('.place-container')).toHaveLength(1);
  });

  it('should render the image carousel', () => {
    expect(wrapper.find('.image-carousel')).toHaveLength(1);
  });

  it('should render the review form', () => {
    expect(wrapper.find('.review-form'))
  });

  it('should render the reviews section', () => {
    expect(wrapper.find('.reviews'))
  });
});
