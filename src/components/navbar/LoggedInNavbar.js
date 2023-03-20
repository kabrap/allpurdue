import './Navbar.css';
import React, {useEffect, useState} from 'react';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import icon from '../../images/profile-icon.png'

function LoggedInNavbar() {
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
        <Link to="/dashboard"><img id='profile-icon-img' src={icon} alt="profile icon"></img></Link>
      </div>
    </nav>
  );
}

export default LoggedInNavbar;
