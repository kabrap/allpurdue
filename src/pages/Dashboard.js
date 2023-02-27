import React, {useEffect, useState} from 'react'
import './Dashboard.css'
import * as ReactDOM from 'react-dom'
import axios from 'axios';


function Dashboard() {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const [currentUser, setCurrentUser] = useState({});

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
    sessionStorage.removeItem("currentUser")
    window.location.href = '/'
  }

  useEffect(() => {
    axios.get('http://localhost:3000/users/')
      .then(response => {
        setCurrentUser(response.data.find(user => user._id === '63fb8ebd4e62a46447f35853'));
        console.log(response.data)
      })
      .catch(error => console.log(error));
  }, );

  const handleSubmit = () => {
    // axios.get
    //if (newPassword == confirmPassword)

    
  }
  
  return (
    <div>
      <div id = "fields">
        <div class="field">
          <label for="username">Username:</label>
          <p id="username">Test username</p>
        </div>
        <div class="field">
          <label for="email">Email:</label>
          <p id="email">Test email</p>
        </div>
        <div class="field" id="passwordField">
          <label for="password">Password:</label>
          <p id="password">*********</p>
        </div>
      </div>

      {changePassword && 
      <div className='change-password-container'>
        <label>Current Password:</label>
        <input id="currentPassword" type="password" onChange={handleCurrentPasswordChange}></input>
        <label>New Password:</label>
        <input id="newPassword" type="password" onChange={handleNewPasswordChange}></input>
        <label>Confirm New Password:</label>
        <input id="confirmPassword" type="password" onChange={handleConfirmPasswordChange}></input>
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