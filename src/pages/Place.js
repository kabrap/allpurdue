import React, {useEffect, useState} from 'react'
import './Place.css'
import AddImage from '../images/addimgicon.png'
import Share from '../images/shareicon.png'
import Pinpoint from '../images/pinpoint.png'
import Bookmark from '../images/bookmark.png'
import Delete from '../images/delete.png'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { Link } from 'react-router-dom'

function Place() {
  const [place, setPlace] = useState({});
  const { id } = useParams();
  const [review, setReview] = useState("");
  const [placesReviews, setPlacesReviews] = useState([])
  const [placesTags, setPlacesTags] = useState([])
  const [placesImages, setPlacesImages] = useState([])
  const [rating, setRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [users, setUsers] = useState([]);
  const author = localStorage.getItem("currentUser");
  const [currentUser, setCurrentUser] = useState("");
  const [suggestedPlaces, setSuggestedPlaces] = useState([])
  const [website, setWebsite] = useState("");
  const [googleMap, setGoogleMap] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:3000/users/${author}`)
      .then(response => {
        setCurrentUser(response.data.name);
      })
      .catch(error => console.log(error));
  }, [author]);
  
  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await axios.get(`http://localhost:3000/places/${id}`);
        setPlace(response.data.place);
        setSuggestedPlaces(response.data.suggestedPlaces);
        setAverageRating(response.data.averageRating);
        setWebsite(response.data.website);
        setGoogleMap(response.data.googleMap);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlace();
  }, [id]);

  useEffect(() => {
    setPlacesReviews(place.reviews || []);
    setPlacesTags(place.tags || []);
    setPlacesImages(place.images || []);
  }, [place]);

  useEffect(() => {
    axios.get('http://localhost:3000/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const newReview = {
      rating,
      review,
      author
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

  const handleLike = async (reviewId) => {
    try {
      const response = await axios.post(`http://localhost:3000/reviews/${reviewId}/like/${author}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (reviewId) => {
    console.log(reviewId)
    try {
      const response = await axios.delete(`http://localhost:3000/places/${id}/reviews/${reviewId}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrevClick = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? placesImages.length - 1 : currentImageIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex(
      currentImageIndex === placesImages.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  const handleWebsiteClick = () => {
    window.open(website, "_blank");
  };

  const handlePinpointClick = () => {
    window.open(googleMap, "_blank");
  };

  return (
    <div className='place-container'>
        <div className='top-container'>
          <div className="image-carousel">
            <div className="place-image">
              <img src={placesImages[currentImageIndex]} alt="place" id="place-img" />
              <button className="prev" onClick={handlePrevClick}>
                &#8249;
              </button>
              <button className="next" onClick={handleNextClick}>
                &#8250;
              </button>
            </div>
          </div>
            <div className='info-container'>
                <div className='info-first-row'>
                    <p onClick={handleWebsiteClick} className="place-name">{place.name}</p>
                    <div className='icons-container'>
                        {/* <img className="share-icon" src={Share} alt="share icon"/> */}
                        <img onClick={handlePinpointClick} className="pinpoint-icon" src={Pinpoint} alt="pinpoint icon"/>
                        <img className="bookmark-icon" src={Bookmark} alt="bookmark icon"/>
                    </div>
                </div>
                <div className="rating">
                  <span className="stars">
                    {Array.from({ length: Math.floor(averageRating) }, (_, index) => (
                      <span key={index}>&#9733;</span>
                    ))}
                    {averageRating % 1 !== 0 ? <span>&#9734;</span> : null}
                    {Array.from(
                      { length: Math.floor(5 - averageRating) },
                      (_, index) => (
                        <span key={index}>&#9734;</span>
                      )
                    )}
                  </span>
                  {averageRating ?
                    <div>
                      <span className="rating-number">{averageRating} Rating | </span> 
                      <span className="rating-number">{placesReviews.length} Reviews</span> 
                    </div>
                  : <span className="rating-number">{placesReviews.length} Reviews</span> 
                  }
                </div>
                <div className='tags-container'>
                    {placesTags.map(tag => (
                        <span id='tag'>{tag}</span>
                    ))}
                </div>
                <span>{place.address}</span>
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
                    <p id="add-review-as">  
                        {currentUser ? (
                            <>Add review as <span id="account-name">{currentUser}</span></>
                        ) : (
                            "Please log in to add a review"
                        )}</p>
                    <div className='text-box-container'>
                        <textarea
                            placeholder="Let us know what you think about this place!"
                            id="review"
                            value={review}
                            onChange={(event) => setReview(event.target.value)}>
                        </textarea>
                        {/* <img className="add-image-icon" src={AddImage} alt="add icon"/> */}
                        <button className='review-button' type="submit" onClick={handleSubmit} disabled={!author} title={!author ? "Please log in to add a review" : ""}>Submit</button>
                    </div>
                </div>
                {/* <span className="sorting">Sort By: <b>Recent</b> &#8595;</span> */}
                <div className='review-container'>
                    <div className='individual-review'>
                        {place && placesReviews.map((review) => {
                            const user = users.find(user => user._id === review.author);
                            const stars = [];
                            for (let i = 1; i <= 5; i++) {
                                if (i <= review.rating) {
                                    stars.push(<span key={i} className="review-stars">&#9733;</span>);
                                } else {
                                    stars.push(<span key={i} className="review-stars">&#9734;</span>);
                                }
                            }
                            let arrowColor = 'white';

                            if (review.likes_by.includes(author)) {
                              arrowColor = '#FFC632';
                            }

                            return (
                              <div key={review._id} className="individual-review-container">
                                <button
                                  id="up-arrow"
                                  style={{
                                    cursor: "pointer",
                                    color: arrowColor,
                                    pointerEvents: author ? "auto" : "none",
                                    opacity: author ? 1 : 0.5,
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                  onClick={() => handleLike(review._id)}
                                  disabled={!author}
                                  title={!author ? "Please log in to like" : ""}
                                >
                                  <span>&#8679;</span>
                                  <span id="review-likes">{review.likes}</span>
                                  <span className="delete-icon-container">
                                    {review.author === author &&
                                      <img className="delete-icon" src={Delete} alt="delete icon" onClick={() => handleDelete(review._id)}/>
                                    }
                                  </span>
                                </button>
                                <div className='individual-review-container-info'>
                                  <p id='review-name'>{user?.name}</p>
                                  <p id='review-stars'>{stars}</p>
                                  <p id='review-text'>{review.text}</p>
                                </div>
                              </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className='suggested-container'>
                <h4>Suggested places</h4>
                <div className='suggested-places'>
                {suggestedPlaces
                  .filter(place => place._id !== id) // filter out current place
                  .filter((place, index, arr) => arr.findIndex(p => p._id === place._id) === index) // filter out duplicates
                  .map(place => (
                    <Link key={place._id} to={`/places/${place._id}`}>
                      <div className='suggested-card'>
                        <img src={place.images[0]} alt="place img"></img>
                        <div className='suggested-card-info'>
                          <p>{place.name}</p>
                          {/* ADD RATING COUNT AND OTHER THINGS TO THE CARD */}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Place