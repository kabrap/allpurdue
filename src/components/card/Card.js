import React, {useState} from 'react';
import './Card.css';
import Chipotle from '../../images/chipotle.jpg'
import { Link } from 'react-router-dom';

const Card = (props) => {
  const placeTypeMap = {
    'Food': 'restaurants',
    'Study': 'study spots',
    'Living': 'residence halls',
    'Cafe': 'cafes'
  }
  const defaultPlaceType = placeTypeMap[props.placeType] || ''

  const [placeType, setPlaceType] = useState(defaultPlaceType)

  let stars = [];
  for (let i = 0; i < props.rating; i++) {
    stars.push(<span key={i}>&#9733;</span>);
  }

  return (
      <div className="card">
        <div className="card-image">
          <img src={Chipotle} alt="place img" />
        </div>
        {/* <div className="card-placeholder">&#128343; 54 mins ago</div> */}
        <div className="card-content">
          <div className="place-header-card">
            <h2 className="place-name-card">{props.name}</h2>
            <div className="rating-recent-review">
              <span className="stars">{stars}</span>
              <span className="rating-number-recent-review">&#40;{props.rating}&#41;</span>
            </div>
          </div>
          <div className='tags-container'>
            {props.tags.slice(0, 3).map(tag => (
              <span id='tag-recent'>{tag}</span>
            ))}
          </div>
          <span id='review-word'>Review</span>
          <span className="review-placeholder">{props.text}</span>
          <div className="card-button">
            <button>All {placeType} &#8594;</button>
          </div>
        </div>
      </div>
  );
};

export default Card;