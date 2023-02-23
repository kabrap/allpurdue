import React, { useState } from 'react';
import './LoginSignup.css';
import axios from 'axios';
import { Link } from 'react-router-dom';


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
        console.log("successful loginnn")
      })
      .catch(function (err) {
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

  return (
    <div className="container">
      <h2 className="title">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
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