import React, { useEffect, useState } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showSignupError, setShowSignupError] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // TODO: Implement login logic using email and password
      await axios.post('http://localhost:3000/login', {
        username: email,
        password: password
      })
      .then(function (res) {
        console.log("successful login")
        console.log(res.data)
        sessionStorage.setItem("currentUser", res.data._id)
        window.location.href = '/'
      })
      .catch(function (err) {
        setErrorMsg(err.response.data)
        setShowLoginError(true);
      })
    } else {
      // TODO: Implement signup logic using email, password, firstName, and lastName
      console.log(name + email + password)

      // Register
      await axios.post('http://localhost:3000/register', {
        name: name,
        username: email,
        password: password
      })
      .then(function (res) {
        setIsLogin(true)
        setShowSignupError(false)
        console.log("successful user creation")
      })
      .catch(function (err) {
        setErrorMsg(err.response.data)
        setShowSignupError(true);
        console.log("unsuccessful user creation")
      })
    }
  };

  const toggleForm = () => {
    setShowSignupError(false)
    setShowLoginError(false)
    setIsLogin(!isLogin)
  }
  
  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:3000') {
        return;
      }
    }, false);
  }, []);

  const handleGoogleClick = async () => {
    window.open('http://localhost:3000/auth/google/allpurdue', '_blank');
  };

  return (
    <div className="container">
      <h2 className="title">{isLogin ? 'Welcome back' : 'Create an account'}</h2>

      <button onClick={handleGoogleClick}>Log in with Google</button>

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
              <span id='password-specifics'>Must be at least 6 characters.</span>
            </label>
          </>
        )}

        {showSignupError && (
          <p className='error-msg'>{errorMsg}</p>
        )}

        {showLoginError && (
          <p className='error-msg'>{errorMsg}</p>
        )}
        <button type="submit" className="submit-button">
          {isLogin ? 'Log In' : 'Create account'}
        </button>
      </form>
      <p className="switch-mode">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={toggleForm} className="switch-button">
          {isLogin ? 'Sign Up' : 'Log in'}
        </button>
      </p>
    </div>
  );
};

export default LoginSignup;