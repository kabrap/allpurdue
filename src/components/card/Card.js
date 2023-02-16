import React from 'react';
import './Card.css'
import Chipotle from '../../images/chipotle.jpg'

function Card() {
  return (
    <div className="card">
      {/* column containing the picture */}
      <div className='picture-col'>
        <img id="chipotle" src={Chipotle} alt="chip pic" />
      </div>

      {/* column containing all the information */}
      <div className='info-col'>
        {/* title, stars, and rating */}
        <div className='row' id='first-row'>
          <h2>Chipotle</h2>
          <p>star</p>
          <p>5.0</p>
        </div>

        {/* tags */}
        <div className='row' id='second-row'>
          <p className='tag-box'>Fast Food</p>
          <p className='tag-box'>Mexican</p>
        </div>

        {/* review header */}
        <div className='row'>
          <h4>Review</h4>
        </div>

        {/* review */}
        <div className='row'>
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
