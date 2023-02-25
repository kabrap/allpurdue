import React from 'react'
import './Place.css'
import Chipotle from '../images/chipotle.jpg'

function Place() {
  return (
    <div>
        <div className='top-container'>
            <div className="place-image">
                <img src={Chipotle} alt="place" />
            </div>
            <div className='info-container'>
                <div className='info-first-row'>
                    <h2 className="place-name">Chipotle</h2>
                    <div>
                        <span>Share</span>
                        <span>Directions</span>
                        <span>Bookmark</span>
                    </div>
                </div>
                <p>200 W State St, West Lafayette, IN 47906</p>
                <div className="rating">
                    <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    <span className="rating-number">57 Reviews</span>
                </div>
                <div className='tags-container'>
                    <span id='tag'>Fast Food</span>
                    <span id='tag'>Mexican</span>
                </div>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
        </div>
        <div className='bottom-container'>
            <div className='reviews-column-container'>
                <div className='add-review-container'>
                    <p id="add-review-title">Add a Review</p>
                    <p id="add-review-rating">Rating: &#9733;&#9733;&#9733;&#9733;&#9733;</p>
                    <p id="add-review-as">Add review as <span id="account-name">someuser123</span></p>
                    <input type="text" placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."></input>
                    <button className='review-button'>Post</button>
                </div>
                <p className="sort-filter">Sort By: <b>Recent</b> &#8595;</p>
                <div className='review-container'>
                    <span id="up-arrow">&#8679;</span>
                    <div className='individual-review'>
                        <p id="individual-review-name">johndoe <span id="time-ago">&#xB7; 9 hr. ago</span></p>
                        <p id="individual-review-review">man chipotle is too good!</p>
                    </div>
                </div>
                <div className='review-container'>
                    <span id="up-arrow">&#8679;</span>
                    <div className='individual-review'>
                        <p id="individual-review-name">johndoe <span id="time-ago">&#xB7; 9 hr. ago</span></p>
                        <p id="individual-review-review">man chipotle is too good!</p>
                    </div>
                </div>
                <div className='review-container'>
                    <span id="up-arrow">&#8679;</span>
                    <div className='individual-review'>
                        <p id="individual-review-name">johndoe <span id="time-ago">&#xB7; 9 hr. ago</span></p>
                        <p id="individual-review-review">man chipotle is too good!</p>
                    </div>
                </div>
            </div>
            <div className='suggested-container'>
                <h4>Suggested places</h4>
                <p>Card for a suggested place</p>
                <p>Card for a suggested place</p>
                <p>Card for a suggested place</p>
                <p>Card for a suggested place</p>
            </div>
        </div>
    </div>
  )
}

export default Place