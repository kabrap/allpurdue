import './Navbar.css';
import React, {useEffect, useState} from 'react';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import icon from '../../images/profile-icon.png'

function Navbar() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));

  useEffect(() => {
    setCurrentUser(localStorage.getItem('currentUser'));
  }, [localStorage.getItem('currentUser')]);

  const handleSignUp = () => {
    console.log('Sign Up');
  };

  const handleLogin = () => {
    console.log('Login');
  };

  console.log(localStorage.getItem('currentUser'))

  return (
    <nav>
      <p><a href='/'>All<span>Purdue</span></a></p>
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/categories">Categories</a></li>
        {/* <li><a href="/blog">Blog</a></li> */}
        <li><a href="/contact">Contact</a></li>
      </ul>
      <div className='nav-buttons'>
      {currentUser !== 'undefined' ?
        <Link to="/dashboard"><img id='profile-icon-img' src={icon} alt="profile icon"></img></Link>
        :
        <>
          <Link to="/loginsignup"><button className="sign-up" text="Sign Up" onClick={handleSignUp}>Sign Up</button></Link>
          <Link to="/loginsignup"><button className="login" text="Login" onClick={handleLogin}>Login</button></Link>
        </>
      }
      </div>
    </nav>
  );
}

export default Navbar;
