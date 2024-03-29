import React, { useState } from 'react';
import './CategoryCard.css';
import { Link } from 'react-router-dom';

const CategoryCard = (props) => {
  return (
    <Link key={props._id} to={`/places/${props._id}`}>
      <div className="category-card">
        <div className="card-image">
          <img src={props.image} alt="restaurant" />
        </div>
        <div className="card-content">
          <div className="restaurant-header">
            <h2 className="restaurant-name">{props.title}</h2>
            <div className="rating">
              <span className="stars">
                {Array.from({ length: Math.floor(props.avgRating) }, (_, index) => (
                  <span key={index}>&#9733;</span>
                ))}
                {props.avgRating % 1 !== 0 ? <span>&#9734;</span> : null}
                {Array.from(
                  { length: Math.floor(5 - props.avgRating) },
                  (_, index) => (
                    <span key={index}>&#9734;</span>
                  )
                )}
              </span>
              <span className="rating-number">&#40;{props.avgRating}&#41;</span>
            </div>
          </div>
          <div className='tags-container'>
            {props.tags.slice(0, 3).map(tag => (
              <span id='tag'>{tag}</span>
            ))}
          </div>
          <span className="review-placeholder">{props.description}</span>
          <div className="card-button">
            {props.placeType === 'Cafe' && <button>All cafes &#8594;</button>}
            {props.placeType === 'Food' && <button>All restaurants &#8594;</button>}
            {props.placeType === 'Living' && <button>All residence halls &#8594;</button>}
            {props.placeType === 'Study' && <button>All study spots &#8594;</button>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;