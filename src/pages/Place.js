import React, {useEffect, useState} from 'react'
import './Place.css'
import Pinpoint from '../images/pinpoint.png'
import Delete from '../images/delete.png'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { Link } from 'react-router-dom'
import ConfirmationDialog from '../components/ConfirmationDialog';
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Place() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [place, setPlace] = useState({});
  const { id } = useParams();
  const [review, setReview] = useState("");
  const [placesReviews, setPlacesReviews] = useState([])
  const [placesTags, setPlacesTags] = useState([])
  const [placesImages, setPlacesImages] = useState([])
  const [placesHours, setPlacesHours] = useState([])
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
  const [errorMsg, setErrorMsg] = useState('')
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState({});
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
        setPlacesHours(response.data.hours)
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
        setUser(response.data.find(user => user._id === author));
      })
      .catch(error => console.log(error));
  }, [author]);

  useEffect( () => {
    axios.get('http://localhost:3000/verify-admin')
    .then(response => {
      console.log(response.data)
      setIsAdmin(true)
    })
    .catch(error => console.log(error));
  }, [isAdmin])

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
      setPlacesReviews([...placesReviews, response.data])
      setErrorMsg('')
      setReview("");
      setShowConfetti(true);
      toast.success("Review created!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
    } catch (error) {
      console.log(error.response.data)
      setErrorMsg(error.response.data)
    }

    try {
      const res = await axios.get(`http://localhost:3000/places/${id}`);
      setAverageRating(res.data.averageRating)
    } catch (error) {
      console.log(error);
    }
  
    setRating(null);
  };

  const handleLike = async (reviewId) => {
    try {
      const response = await axios.post(`http://localhost:3000/reviews/${reviewId}/like/${author}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get(`http://localhost:3000/places/${id}`);
      setPlacesReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavorite = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/save-place/${id}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    axios.get('http://localhost:3000/users/')
    .then(response => {
      setUser(response.data.find(user => user._id === localStorage.getItem("currentUser")));
    })
    .catch(error => console.log(error));
  };
  

    const handleDeletePlace = async() => {
    try {
      const response = await axios.delete(`http://localhost:3000/places/delete/${id}`);
      console.log(response.data);
      window.location.href = `/categories/`
    } catch (error) {
      console.log(error);
    }
  }

  const handleFeaturePlace = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/feature-place/${id}`);
      toast.success(
        <div className="toast-container">
          Place is now featured!
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (reviewId) => {
    setShowConfirmationDialog(false);
    console.log(reviewId)
    const updatedReviews = placesReviews.filter((review) => review._id !== reviewId);
    setPlacesReviews(updatedReviews)
    try {
      const response = await axios.delete(`http://localhost:3000/places/${id}/reviews/${reviewId}`);
      console.log(response.data.review);
    } catch (error) {
      console.log(error);
    }

    try {
      const res = await axios.get(`http://localhost:3000/places/${id}`);
      console.log(res.data)
      setAverageRating(res.data.averageRating)
      console.log(res.data.averageRating)
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmationDialog(true);
  }

  const handleCancelDelete = () => {
    setShowConfirmationDialog(false);
  }

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

  function handleImageClick() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className='place-container'>
        <div className='top-container'>
          <div className="image-carousel">
            <div className="place-image">
              <img
                src={placesImages[currentImageIndex]}
                alt="place"
                id="place-img"
                onClick={handleImageClick}
              />
              {isExpanded && (
                <div className="expanded-image-overlay" onClick={handleImageClick}>
                  <img src={placesImages[currentImageIndex]} alt="place" id="expanded-place-img" />
                </div>
              )}
              {!isExpanded && (
                <div>
                  <button className="prev" onClick={handlePrevClick}>
                    &#8249;
                  </button>
                  <button className="next" onClick={handleNextClick}>
                    &#8250;
                  </button>
                </div>
              )}
            </div>
          </div>
            <div className='info-container'>
                <div className='info-first-row'>
                  <div className="name-edit-row">
                      <p onClick={handleWebsiteClick} className="place-name">{place.name}</p>
                      {isAdmin &&
                        <button className="edit-button" onClick={() => window.location.href = `../edit-place/${id}`}>Edit</button>
                      }
                      {isAdmin &&
                        <button className="delete-button" onClick={handleDeletePlace}>Delete</button>
                      }
                      {isAdmin &&
                        <button className="feature-button" onClick={handleFeaturePlace}>Feature</button>
                      }
                    </div>
                    <div className='icons-container'>
                        {/* <img className="share-icon" src={Share} alt="share icon"/> */}
                        <img onClick={handlePinpointClick} className="pinpoint-icon" src={Pinpoint} alt="pinpoint icon"/>
                        {user && (<span onClick={handleFavorite} className={user.savedPlaces && user.savedPlaces.includes(place._id) ? 'favorite-icon red' : 'favorite-icon'}>&#x2764;</span>)}
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
                    <div className='ratings-reviews-container'>
                      <span className="rating-number">&#40;{averageRating.toFixed(1)}&#41;</span> 
                      <span className="rating-number">{placesReviews.length} Reviews</span> 
                    </div>
                  : <span className="rating-number">{placesReviews.length} Reviews</span> 
                  }
                </div>
                <div className='tags-container-place'>
                  <span id='tag'>{placesTags[0]}</span>
                  <span id='tag'>{placesTags[1]}</span>
                  <span id='tag'>{placesTags[2]}</span>
                  <span id='tag'>{placesTags[3]}</span>
                </div>
                <span>{place.address}</span>
                <p>{place.description}</p>
                <div>
                  {placesHours.length !== 0 ?
                    <div className='hours-container'>
                      <span>Hours of operation</span>
                      <span>SU: {placesHours[0]}</span>
                      <span>M: {placesHours[1]}</span>
                      <span>T: {placesHours[2]}</span>
                      <span>W: {placesHours[3]}</span>
                      <span>TH: {placesHours[4]}</span>
                      <span>F: {placesHours[5]}</span>
                      <span>SA: {placesHours[6]}</span>
                    </div>
                    : <div className='hours-container'>
                        <span>Hours of operation</span>
                        <span>N/A</span>
                      </div>
                  }
                </div>
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
                    {errorMsg !== '' && <p className='error-msg'>{errorMsg}</p>}
                    {!isExpanded && (
                      <div className='text-box-container'>
                        <textarea
                          placeholder="Let us know what you think about this place!"
                          id="review"
                          value={review}
                          onChange={(event) => setReview(event.target.value)}>
                        </textarea>
                        {/* <img className="add-image-icon" src={AddImage} alt="add icon"/> */}
                        <button className='review-button' type="submit" onClick={handleSubmit} disabled={!currentUser} title={!currentUser ? "Please log in to add a review" : ""}>Submit</button>
                      </div>
                    )}
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
                                      <img className="delete-icon" src={Delete} alt="delete icon" onClick={handleConfirmDelete} />
                                    }
                                  </span>
                                </button>
                                <div className='individual-review-container-info'>
                                  <p id='review-name'>{user?.name}</p>
                                  <p id='review-stars'>{stars}</p>
                                  <p id='review-text'>{review.text}</p>
                                </div>
                                <ConfirmationDialog
                                  open={showConfirmationDialog}
                                  onClose={handleCancelDelete}
                                  onConfirm={() => handleDelete(review._id)}
                                  message="Are you sure you want to delete this review?"
                                />
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
        {showConfetti && <Confetti />}
        <ToastContainer />
    </div>
  )
}

export default Place