import React, {useEffect, useState} from 'react'
import './Place.css'
import Chipotle from '../images/chipotle.jpg'
import AddImage from '../images/addimgicon.png'
import Share from '../images/shareicon.png'
import Pinpoint from '../images/pinpoint.png'
import Bookmark from '../images/bookmark.png'
import { useParams } from 'react-router-dom';
import axios from 'axios'

function Place() {
  const [place, setPlace] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await axios.get(`http://localhost:3000/places/${id}`);
        setPlace(response.data);
        console.log(place)
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlace();
  }, [id]);

  return (
    <div className='place-container'>
        <div className='top-container'>
            <div className="place-image">
                <img src={Chipotle} alt="place" id="place-img"/>
            </div>
            <div className='info-container'>
                <div className='info-first-row'>
                    <p className="place-name">{place.name}</p>
                    <div className='icons-container'>
                        <img className="share-icon" src={Share} alt="share icon"/>
                        <img className="pinpoint-icon" src={Pinpoint} alt="pinpoint icon"/>
                        <img className="bookmark-icon" src={Bookmark} alt="bookmark icon"/>
                    </div>
                </div>
                <div className="rating">
                    <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                    {/* <span className="rating-number">{place.reviews.length} Reviews</span> */}
                </div>
                <div className='tags-container'>
                    {/* {place.tags.map(tag => (
                        <span id='tag'>{tag}</span>
                    ))} */}
                </div>
                <p>{place.description}</p>
            </div>
        </div>
        <div className='bottom-container'>
            <div className='reviews-column-container'>
                <div className='add-review-container'>
                    <p id="add-review-title">Add a Review</p>
                    <p id="add-review-rating">Rating: &#9733;&#9733;&#9733;&#9733;&#9733;</p>
                    <p id="add-review-as">Add review as <span id="account-name">someuser123</span></p>
                    <div className='text-box-container'>
                        <textarea type="text" placeholder="Let us know what you think about <place name>!"></textarea>
                        <img className="add-image-icon" src={AddImage} alt="add icon"/>
                        <button className='review-button'>Post</button>
                    </div>
                </div>
                <span className="sorting">Sort By: <b>Recent</b> &#8595;</span>
                <div className='review-container'>
                    <span id="up-arrow">&#8679;</span>
                    <div className='individual-review'>
                        <p id="individual-review-name">johndoe <span id="time-ago">&#xB7; 9 hr. ago</span></p>
                        <span className="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                        <p id="individual-review-review">man chipotle is too good!</p>
                    </div>
                </div>
            </div>
            <div className='suggested-container'>
                <h4>Suggested places</h4>
                <p>Card for a suggested place</p>
                <p>Card for a suggested place</p>
            </div>
        </div>
    </div>
  )
}

export default Place