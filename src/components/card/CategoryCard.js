import React from 'react';
import './CategoryCard.css';
import Chipotle from '../../images/chipotle.jpg'
import { Link } from 'react-router-dom';

const Card = (props) => {
  console.log(props._id)
  return (
    <Link key={props._id} to={`/places/${props._id}`}>
      <div className="card">
        <div className="card-image">
          <img src={Chipotle} alt="restaurant" />
        </div>
        <div className="card-content">
          <div className="restaurant-header">
            <h2 className="restaurant-name">{props.title}</h2>
            <div className="rating">
              <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span className="rating-number">&#40;{props.avgRating}&#41;</span>
            </div>
          </div>
          <div className='tags-container'>
            {props.tags.map(tag => (
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

export default Card;