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
  const [review, setReview] = useState("");
  const [placesReviews, setPlacesReviews] = useState([])
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await axios.get(`http://localhost:3000/places/${id}`);
        setPlace(response.data);
        console.log(place);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlace();
  }, [id]);

  useEffect(() => {
    setPlacesReviews(place.reviews || []);
  }, [place]);

  useEffect(() => {
    fetch(`http://localhost:3000/users/`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = async (event) => {
    console.log(review);
    console.log(rating);
    event.preventDefault();
    const newReview = {
        rating,
        review
      };

    try {
        const response = await axios.post(`http://localhost:3000/places/${id}/reviews`, newReview);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }

    setReview("");
    setRating(null);
  };

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
                    {/* <span className="rating-number">{place.reviews.length} Reviews</span>  */}
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
                    <div className="rating-container">
                        <p id="add-review-rating">Rating:</p>
                        <div>
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <span 
                                        key={ratingValue} 
                                        style={{ cursor: "pointer", color: ratingValue <= (hover || rating) ? "#FFC632" : "#e4e5e9" }}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(null)}
                                        onClick={() => setRating(ratingValue)}
                                    >&#9733;</span>
                                );
                            })}
                        </div>
                    </div>
                    <p id="add-review-as">Add review as <span id="account-name">someuser123</span></p>
                    <div className='text-box-container'>
                        <textarea
                            placeholder="Let us know what you think about this place!"
                            id="review"
                            value={review}
                            onChange={(event) => setReview(event.target.value)}>
                        </textarea>
                        <img className="add-image-icon" src={AddImage} alt="add icon"/>
                        <button className='review-button' type="submit" onClick={handleSubmit}>Post</button>
                    </div>
                </div>
                <span className="sorting">Sort By: <b>Recent</b> &#8595;</span>
                <div className='review-container'>
                    <div className='individual-review'>
                        {place && placesReviews.map((review) => {
                            const user = users.find(user => user._id === review.author);
                            console.log(user)
                            const stars = [];
                            for (let i = 1; i <= 5; i++) {
                                if (i <= review.rating) {
                                    stars.push(<span key={i} className="review-stars">&#9733;</span>);
                                } else {
                                    stars.push(<span key={i} className="review-stars">&#9734;</span>);
                                }
                            }
                            return (
                                <div key={review._id}>
                                    <span id="up-arrow">&#8679;</span>
                                    <p>{user.name}</p>
                                    <p>review rating: {stars}</p>
                                </div>
                            );
                        })}
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