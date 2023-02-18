import React from 'react';
import './CategoryCard.css';
import Chipotle from '../../images/chipotle.jpg'

const Card = () => {
  return (
    <div className="card">
      <div className="card-image">
        <img src={Chipotle} alt="restaurant" />
      </div>
      <div className="card-content">
        <div className="restaurant-header">
          <h2 className="restaurant-name">Chipotle</h2>
          <div className="rating">
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="rating-number">&#40;5.0&#41;</span>
          </div>
        </div>
        <div className='tags-container'>
          <span id='tag'>Fast Food</span>
          <span id='tag'>Mexican</span>
        </div>
        <span className="review-placeholder">A brief review created by the user here. I am just typing this now as a placeholder.</span>
        <div className="card-button">
          <button>All restaurants &#8594;</button>
        </div>
      </div>
    </div>
  );
};

export default Card;