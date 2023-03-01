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
    } else if (newPassword === confirmPassword) {
      axios.post('http://localhost:3000/change-password', {
        currentPassword: currentPassword,
        newPassword: newPassword,
        userId: localStorage.getItem("currentUser")
      })
      .then(function (res) {
        console.log('password changed!')
        setErrorMsg("")
      })
      .catch(function (err) {
        console.log(err)
        console.log("current password doesn't match")
        setErrorMsg("Current password doesn't match!")
      })
    } else {
      console.log("passwords don't match")
      setErrorMsg("Passwords don't match!")
    }
  }
  
  return (
    <div>
      <div id = "fields">
        <div class="field">
          <label for="username">Name:</label>
          <p id="username">{user.name}{purdueVerified && <img alt='Verified Purdue User' src="https://img.icons8.com/windows/32/FAB005/instagram-check-mark.png"/>}</p>
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
  )
}

export default Dashboard