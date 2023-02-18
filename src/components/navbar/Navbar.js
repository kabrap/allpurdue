import './Navbar.css';
import React from 'react';
import Button from '../button/Button';
import { Link } from 'react-router-dom';

function Navbar() {

  const handleSignUp = () => {
    console.log('Sign Up');
  };

  const handleLogin = () => {
    console.log('Login');
  };

  return (
    <nav>
      <p><a href='/'>All<span>Purdue</span></a></p>
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/categories">Categories</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className='nav-buttons'>
        <Link to="/sign-up"><button className="sign-up" text="Sign Up" onClick={handleSignUp}>Sign Up</button></Link>
        <Link to="/login"><button className="login" text="Login" onClick={handleLogin}>Login</button></Link>
      </div>
    </nav>
  );
}

export default Navbar;
