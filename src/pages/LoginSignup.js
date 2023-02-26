import React, { useState } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@leecheuk/react-google-login'
// import dotenv from 'dotenv'

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // TODO: Implement login logic using email and password
      axios.post('http://localhost:3000/login', {
        username: email,
        password: password
      })
      .then(function (res) {
        console.log("successful login")
        sessionStorage.setItem("isLogin", "true")
        window.location.href = '/'
      })
      .catch(function (err) {
        console.log(err)
        console.log("unsuccessful login")
      })
    } else {
      // TODO: Implement signup logic using email, password, firstName, and lastName
      console.log(name + email + password)

      // Register
      axios.post('http://localhost:3000/register', {
        name: name,
        username: email,
        password: password
      })
      .then(function (res) {
        setIsLogin(true)
        console.log("successful user creation")
      })
      .catch(function (err) {
        console.log("unsuccessful user creation")
      })
    }
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login success:', response);
    // Perform any additional actions here, such as sending the user's Google ID token to the server for verification
  };
  
  return (
    <div className="container">
      <h2 className="title">{isLogin ? 'Welcome back' : 'Create an account'}</h2>

      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        clientSecret={process.env.REACT_APP_GOOGLE_CLIENT_SECRET}
        buttonText="Login with Google"
        onSuccess={handleGoogleLoginSuccess}
        cookiePolicy={'single_host_origin'}
      />

      <form className="form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <label className='field-container'>
              <span>Name</span>
              <input type="text" value={name} onChange={handleNameChange} placeholder="Enter your name" required />
            </label>
            <br />
          </>
        )}
        <label className='field-container'>
          <span>Email</span>
          <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" required />
        </label>
        <br />
        <label className='field-container'>
          <span>Password</span>
          <input type="password" value={password} onChange={handlePasswordChange} placeholder="Create a password" required />
        </label>
        {isLogin && (
          <>
            <label className='field-container'>
              <Link to='/forgot-password'><span id='forgot-password'>Forgot password</span></Link>
            </label>
          </>
        )}
        {!isLogin && (
          <>
            <label className='field-container'>
              <span id='password-specifics'>Must be at least 8 characters.</span>
            </label>
          </>
        )}
        <button type="submit" className="submit-button">
          {isLogin ? 'Log In' : 'Create account'}
        </button>
      </form>
      <p className="switch-mode">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={() => setIsLogin(!isLogin)} className="switch-button">
          {isLogin ? 'Sign Up' : 'Log in'}
        </button>
      </p>
    </div>
  );
};

export default LoginSignup;