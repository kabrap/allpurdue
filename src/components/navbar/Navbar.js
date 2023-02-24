import './Navbar.css';
import React from 'react';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import icon from '../../images/profile-icon.png'

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
        {sessionStorage.getItem('isLogin') === null && sessionStorage.getItem('isLogin') !== 'true' && 
          <>
            <Link to="/loginsignup"><button className="sign-up" text="Sign Up" onClick={handleSignUp}>Sign Up</button></Link>
            <Link to="/loginsignup"><button className="login" text="Login" onClick={handleLogin}>Login</button></Link>
          </>
        }
        {sessionStorage.getItem('isLogin') !== null && sessionStorage.getItem('isLogin') === 'true' && 
          <>
            <Link to="/dashboard"><img id='profile-icon-img' src={icon} alt="profile icon"></img></Link>
          </>
        }
      </div>
    </nav>
  );
}

export default Navbar;
