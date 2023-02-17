import './Navbar.css';
import React from 'react';
import Button from '../button/Button';

function Navbar() {

  const handleSignUp = () => {
    console.log('Sign Up');
  };

  const handleLogin = () => {
    console.log('Login');
  };

  return (
    <nav>
      <p>All<span>Purdue</span></p>
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/categories">Categories</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className='nav-buttons'>
        <Button className="sign-up" text="Sign Up" onClick={handleSignUp}/>
        <Button className="login" text="Login" onClick={handleLogin}/>
      </div>
    </nav>
  );
}

export default Navbar;
