import './Navbar.css';
import React, {useEffect, useState} from 'react';
import Button from '../button/Button';
import { Link } from 'react-router-dom';

function Navbar() {
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
        <Link to="/loginsignup"><button className="sign-up" text="Sign Up">Sign Up</button></Link>
        <Link to="/loginsignup"><button className="login" text="Login">Login</button></Link>
      </div>
    </nav>
  );
}

export default Navbar;
