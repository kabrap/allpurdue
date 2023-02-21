import React, { useState } from 'react';
import './LoginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // TODO: Implement login logic using email and password
    } else {
      // TODO: Implement signup logic using email, password, firstName, and lastName
    }
  };

  return (
    <div className="container">
      <h2 className="title">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
      <form className="form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <label className='field-container'>
              <span>First Name</span>
              <input type="text" value={firstName} onChange={handleFirstNameChange} placeholder="Enter your first name" required />
            </label>
            <br />
            <label className='field-container'>
              <span>Last Name</span>
              <input type="text" value={lastName} onChange={handleLastNameChange} placeholder="Enter your last name" required />
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
              <span id='forgot-password'>Forgot password</span>
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