import React, {useEffect, useState} from 'react'
import './Dashboard.css'
import axios from 'axios';
import { Link } from 'react-router-dom'
import Delete from '../images/delete.png'
import Edit from '../images/edit.png'
import Badge from '../images/badge.png'
import ConfirmationDialog from '../components/ConfirmationDialog';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const userId = localStorage.getItem("currentUser");
  const [user, setUser] = useState({});
  const [purdueVerified, setPurdueVerified] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([])
  const [showBlogConfirmationDialog, setShowBlogConfirmationDialog] = useState(false);
  const [showReviewConfirmationDialog, setShowReviewConfirmationDialog] = useState(false);

  const [activeComponent, setActiveComponent] = useState('blogs');

  const [places, setPlaces] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const logout = () => {
    localStorage.removeItem('currentUser')
    axios.get('http://localhost:3000/logout')
    window.location.href = '/'
  }

  useEffect(() => {
    axios.get('http://localhost:3000/users/')
      .then(response => {
        setUser(response.data.find(user => user._id === userId));
        setSavedPlaces(response.data.find(user => user._id === userId).savedPlaces);
        console.log(response.data.find(user => user._id === userId).savedBlogs)
        setSavedBlogs(response.data.find(user => user._id === userId).savedBlogs);
        console.log(savedPlaces)
        if (response.data.find(user => user._id === userId).email.includes('purdue.edu')) {
          console.log(user.email)
          setPurdueVerified(true)
          console.log(purdueVerified)
        }
      })
      .catch(error => console.log(error));

    axios.get('http://localhost:3000/recent-reviews')
    .then(response => {
      setReviews(response.data)
    })
    .catch(error => console.log(error));

    axios.get('http://localhost:3000/verify-admin')
    .then(response => {
      console.log(response.data)
      setIsAdmin(true)
    })
    .catch(error => console.log(error));
  }, []);

  useEffect( () => {
    axios.get('http://localhost:3000/verify-admin')
    .then(response => {
      console.log(response.data)
      setIsAdmin(true)
    })
    .catch(error => console.log(error));
  }, [isAdmin])

  const handleSubmit = () => {
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      setErrorMsg('Password needs to be at least 6 characters!')
      setSuccessMsg("")
    } else if (newPassword === confirmPassword) {
      axios.post('http://localhost:3000/change-password', {
        currentPassword: currentPassword,
        newPassword: newPassword,
        userId: localStorage.getItem("currentUser")
      })
      .then(function (res) {
        console.log('password changed!')
        setSuccessMsg("Password changed!")
        setErrorMsg("")
      })
      .catch(function (err) {
        console.log(err)
        console.log("current password doesn't match")
        setErrorMsg("Current password doesn't match!")
        setSuccessMsg("")
      })
    } else {
      console.log("passwords don't match")
      setErrorMsg("Passwords don't match!")
      setSuccessMsg("")
    }
  }
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  });

  useEffect(() => {
    axios.get('http://localhost:3000/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/places');
        setPlaces(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  const getAuthorName = (blog) => {
    const author = users.find(user => user._id === blog.author);
    return author ? author.name : '';
  }

  const getAuthorNameReview = (review) => {
    const author = users.find(user => user._id === review);
    return author ? author.name : '';
  }

  const handleDeleteBlog = async (blogId) => {
    setShowBlogConfirmationDialog(false);
    console.log(blogId)
    const updatedBlogs = blogs.filter((blog) => blog._id !== blogId);
    setBlogs(updatedBlogs)
    try {
      const response = await axios.delete(`http://localhost:3000/blogs/${blogId}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.get('http://localhost:3000/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlace = async (placeId) => {
    console.log(placeId)
    const updatedPlaces = places.filter((place) => place._id !== placeId);
    setPlaces(updatedPlaces)
    console.log(places)
    try {
      const response = await axios.delete(`http://localhost:3000/places/delete/${placeId}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.get('http://localhost:3000/places');
      console.log(response.data)
      setPlaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReview = async (placeId, reviewId) => {
    setShowReviewConfirmationDialog(false);
    const updatedReviews = reviews.filter((review) => review._id !== reviewId);
    setReviews(updatedReviews)
    try {
      const response = await axios.delete(`http://localhost:3000/places/${placeId}/reviews/${reviewId}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.get('http://localhost:3000/recent-reviews');
      console.log(response.data)
      setReviews(response.data);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get('http://localhost:3000/places');
      console.log(response.data)
      setPlaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const unfavoritePlace = async (placeId) => {
    try {
      const author = localStorage.getItem("currentUser");
      const response = await axios.post(`http://localhost:3000/places/${placeId}/save-place/${author}`);
      setSavedPlaces(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const unfavoriteBlog = async (blogId) => {
    try {
      const response = await axios.post(`http://localhost:3000/save-blog/${blogId}`);
      setSavedBlogs(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleBlogConfirmDelete = () => {
    setShowBlogConfirmationDialog(true);
  }

  const handleBlogCancelDelete = () => {
    setShowBlogConfirmationDialog(false);
  }

  const handleReviewConfirmDelete = () => {
    setShowReviewConfirmationDialog(true);
  }

  const handleReviewCancelDelete = () => {
    setShowReviewConfirmationDialog(false);
  }

  const handleFeaturePlace = async (placeId) => {
    try {
      const response = await axios.post(`http://localhost:3000/feature-place/${placeId}`);
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

  const handleFeatureBlog = async (blogId) => {
    try {
      const response = await axios.post(`http://localhost:3000/feature-blog/${blogId}`);
      toast.success(
        <div className="toast-container">
          Blog is now featured!
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

  return (
    <div>
      {/* Change Password */}
      <div>
        <div id = "fields">
          <div class="field">
            <label for="username">Name:</label>
            <p id="username">{user.name}{purdueVerified && <img alt='Verified Purdue User' src="https://img.icons8.com/color/96/null/verified-account--v1.png"/>}</p>
          </div>
          <div class="field">
            <label for="email">Email:</label>
            <p id="email">{user.email}</p>
          </div>
          <div class="field" id="passwordField">
            <label for="password">Password:</label>
            <p id="password">*********</p>
          </div>
        </div>

        {changePassword && 
        <div className='change-password-container'>
          <label>Current Password:</label>
          <input id="currentPassword" type="password" onChange={handleCurrentPasswordChange} required></input>
          <label>New Password:</label>
          <input id="newPassword" type="password" onChange={handleNewPasswordChange} required></input>
          <label>Confirm New Password:</label>
          <input id="confirmPassword" type="password" onChange={handleConfirmPasswordChange} required></input>
          {errorMsg !== '' && <p className='error-msg'>{errorMsg}</p>}
          {successMsg !== '' && <p className='success-msg'>{successMsg}</p>}
          <button id="submitButton" onClick={handleSubmit}>Submit</button>
        </div>
        }

        {!changePassword &&
        <div id = "changePasswordButton">
          <button id="passwordButton" onClick={() => setChangePassword(!changePassword)}>Change password</button>
        </div>
        }
        {isAdmin && <br />}
        {isAdmin &&
          <div id = "addLocationButton">
            <button id="addLocationButton" onClick={() => window.location.href = "/add-location"}>Add Location</button>
          </div>
        }
        <br/>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Tables for blogs, places, and reviews */}
      <div className='table-header-container'>
        {/* Buttons to toggle between tables */}
        <button className={activeComponent === 'blogs' ? 'selected' : ''} onClick={() => handleComponentChange('blogs')}>Blogs</button>
        <button className={activeComponent === 'reviews' ? 'selected' : ''} onClick={() => handleComponentChange('reviews')}>Reviews</button>
        {!isAdmin && (
          <button className={activeComponent === 'favorites' ? 'selected' : ''} onClick={() => handleComponentChange('favorites')}>Favorites</button>
        )}
        {!isAdmin && (
          <button className={activeComponent === 'savedBlogs' ? 'selected' : ''} onClick={() => handleComponentChange('savedBlogs')}>Saved Blogs</button>
        )}
        {isAdmin && (
          <button className={activeComponent === 'places' ? 'selected' : ''} onClick={() => handleComponentChange('places')}>Places</button>
        )}
      </div>
        <div className='table-container'>
          {/* Show blogs table */}
          {activeComponent === 'blogs' && (
            <table>
              {/* Admin view */}
              {isAdmin && (
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>User</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
              )}
              {isAdmin && (
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                      </td>
                      <td>{blog.text}</td>
                      <td>{getAuthorName(blog)}</td>
                      <td>{formatDate(blog.createdAt)}</td>
                      <td><img className="dashboard-delete-icon" src={Delete} alt="delete icon" onClick={handleBlogConfirmDelete}/></td>
                      <img className="dashboard-feature-icon" src={Badge} alt="feature icon" onClick={() => handleFeatureBlog(blog._id)}/>
                      <ConfirmationDialog
                        open={showBlogConfirmationDialog}
                        onClose={handleBlogCancelDelete}
                        onConfirm={() => handleDeleteBlog(blog._id)}
                        message="Are you sure you want to delete this blog post?"
                      />
                    </tr>
                  ))}
                </tbody>
              )}


              {/* User view */}
              {!isAdmin && (
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Date Created</th>
                    </tr>
                </thead>
              )}
              {!isAdmin && (
                <tbody>
                  {blogs.filter(blog => blog.author === localStorage.getItem("currentUser")).map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                      </td>
                      <td>{blog.text}</td>
                      <td>{formatDate(blog.createdAt)}</td>
                      <td><img className="dashboard-delete-icon" src={Delete} alt="delete icon" onClick={handleBlogConfirmDelete}/></td>
                      <ConfirmationDialog
                        open={showBlogConfirmationDialog}
                        onClose={handleBlogCancelDelete}
                        onConfirm={() => handleDeleteBlog(blog._id)}
                        message="Are you sure you want to delete this blog post?"
                      />
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          )}

          {/* Show admin places table */}
          {activeComponent === 'places' && (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Reviews</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr key={place._id}>
                    <td>
                      <Link to={`/places/${place._id}`}>{place.name}</Link>
                    </td>
                    <td>{place.placeType}</td>
                    <td>{place.reviews.length}</td>
                    <td>
                      <Link to={`/places/${place._id}`}>
                        <img className="dashboard-edit-icon" src={Edit} alt="edit icon"/>
                      </Link>
                    </td>
                    <td>
                      <img className="dashboard-delete-icon" src={Delete} alt="delete icon" onClick={() => handleDeletePlace(place._id)}/>
                    </td>
                    <img className="dashboard-feature-icon" src={Badge} alt="feature icon" onClick={() => handleFeaturePlace(place._id)}/>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Show reviews table */}
          {activeComponent === 'reviews' && (
            <table>
              {/* Admin view */}
              {isAdmin && (
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Comment</th>                  
                    <th>User</th>
                    <th>Rating</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
              )}
              {isAdmin && (
                <tbody>
                  {reviews.map((review) => {
                    return (
                      <tr key={review._id}>
                        <td>{review.place.name}</td>
                        <td>{review.text}</td>
                        <td>{getAuthorNameReview(review.author)}</td>
                        <td>{review.rating}</td>
                        <td>{formatDate(review.createdAt)}</td>
                        <img className="dashboard-delete-icon" src={Delete} alt="delete icon" onClick={handleReviewConfirmDelete}/>
                        <ConfirmationDialog
                          open={showReviewConfirmationDialog}
                          onClose={handleReviewCancelDelete}
                          onConfirm={() => handleDeleteReview(review.place._id, review._id)}
                          message="Are you sure you want to delete this review?"
                        />
                      </tr>
                    )
                  })}
                </tbody>
              )}

              {/* User view */}
              {!isAdmin && (
                <thead>
                  <tr>
                    <th>Place</th>
                    <th>Comment</th>                  
                    <th>Rating</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
              )}
              {!isAdmin && (
                <tbody>
                  {reviews.filter(review => review.author === localStorage.getItem("currentUser")).map((review) => (
                    <tr key={review._id}>
                      <td>{review.place.name}</td>
                      <td>{review.text}</td>
                      <td>{review.rating}</td>
                      <td>{formatDate(review.createdAt)}</td>
                      <img className="dashboard-delete-icon" src={Delete} alt="delete icon" onClick={handleReviewConfirmDelete}/>
                      <ConfirmationDialog
                        open={showReviewConfirmationDialog}
                        onClose={handleReviewCancelDelete}
                        onConfirm={() => handleDeleteReview(review.place._id, review._id)}
                        message="Are you sure you want to delete this review?"
                      />
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          )}

          {/* Show favorites table */}
          {activeComponent === 'favorites' && (
            <table>
              {/* User view */}
              <thead>
                <tr>
                  <th>Place</th>
                  <th>Description</th>                  
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
              {places.filter(place => savedPlaces.includes(place._id)).map(place => (
                  <tr key={place._id}>
                    <td>
                      <Link to={`/places/${place._id}`}>{place.name}</Link>
                    </td>
                    <td>{place.description}</td>
                    <td>{place.placeType}</td>
                    <img className="dashboard-delete-icon" src={Delete} alt="delete icon" onClick={() => unfavoritePlace(place._id)}/>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Show saved blogs table */}
          {activeComponent === 'savedBlogs' && (
            <table>
              {/* User view */}
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Content</th>                  
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
              {blogs.filter(blog => savedBlogs.includes(blog._id)).map(blog => (
                  <tr key={blog._id}>
                    <td>
                      <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                    </td>
                    <td>{blog.text}</td>
                    <td>{blog.tags[0]}</td>
                    <img className="dashboard-delete-icon" src={Delete} alt="delete icon" onClick={() => unfavoriteBlog(blog._id)}/>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <ToastContainer />

      </div>      
  )
}

export default Dashboard