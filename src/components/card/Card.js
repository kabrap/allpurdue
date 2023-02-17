import React from 'react';
import './Card.css'
import Chipotle from '../../images/chipotle.jpg'
import Star from '../../images/star.png'

function Card() {
  return (
    <div className="card">
      {/* column containing the picture */}
      <div className='picture-col' >
        <img id="chipotle" src={Chipotle} alt="chip pic" />
      </div>

      {/* column containing all the information */}
      <div className='info-col'>
        {/* title, stars, and rating */}
        <div className='row' id='first-row'>
          <p id='place-name'>Chipotle</p>
          <img id="full-star" src={Star} alt="rating star" />
          <img id="full-star" src={Star} alt="rating star" />
          <img id="full-star" src={Star} alt="rating star" />
          <img id="full-star" src={Star} alt="rating star" />
          <img id="full-star" src={Star} alt="rating star" />
          <p id='rating'><span>&#40;</span>5.0<span>&#41;</span></p>
        </div>

        {/* tags */}
        <div className='row' id='second-row'>
          <p className='tag-box'>Fast Food</p>
          <p className='tag-box'>Mexican</p>
        </div>

        {/* review header */}
        <div className='row'>
          <p id='review-header'>Review</p>

        {/* review */}
          <p>Very good restaurant</p>
        </div>
      </div>
      {/* column containing time and button */}
      <div className='misc-col'>

      </div>
    </div>
  );
}

export default Card;
