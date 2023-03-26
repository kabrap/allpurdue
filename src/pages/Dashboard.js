import React, {useEffect, useState} from 'react'
import './Dashboard.css'
import * as ReactDOM from 'react-dom'
import axios from 'axios';


function Dashboard() {
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
  const [showBlogs, setShowBlogs] = useState(true);
  const [places, setPlaces] = useState([])

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
        if (response.data.find(user => user._id === userId).email.includes('purdue.edu')) {
          console.log(user.email)
          setPurdueVerified(true)
          console.log(purdueVerified)
        }
      })
      .catch(error => console.log(error));
  }, []);

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
        console.log(response.data)
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

  const handleDeleteBlog = async (blogId) => {
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
    try {
      const response = await axios.delete(`http://localhost:3000/places/${placeId}`);
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

  const handleEdit = (blogId) => {
  };

  const handleShowBlogs = () => {
    setShowBlogs(true);
  };

  const handleShowPlaces = () => {
    setShowBlogs(false);
  };
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
        <br/>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Tables for blogs and places */}
      <div className='entire-tables-container'>

        {/* Buttons to toggle between tables */}
        <button onClick={handleShowBlogs}>Blogs</button>
        <button onClick={handleShowPlaces}>Places</button>

        <div>
          {showBlogs ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date Created</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>{blog.title}</td>
                    <td>{getAuthorName(blog)}</td>
                    <td>{formatDate(blog.createdAt)}</td>
                    <td>
                      <button onClick={() => handleEdit(blog._id)}>Edit</button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Reviews</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place._id}>
                  <td>{place.name}</td>
                  <td>{place.placeType}</td>
                  <td>{place.reviews.length}</td>
                  <td>
                    <button onClick={() => handleEdit(place._id)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDeletePlace(place._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard