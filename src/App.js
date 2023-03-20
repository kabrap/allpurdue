import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import LoggedInNavbar from './components/navbar/LoggedInNavbar';
import React, {useEffect, useState} from 'react'
import Home from './pages/Home'
import About from './pages/About'
import Categories from './pages/categories/Categories';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import LoginSignup from './pages/LoginSignup';
import Cafes from './pages/categories/Cafes'
import Restaurants from './pages/categories/Restaurants'
import Residence from './pages/categories/Residence'
import Study from './pages/categories/Study'
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard'
import Place from './pages/Place'
import axios from 'axios';
import BlogPost from './pages/BlogPost';

function App() {
  const [currentUser, setCurrentUser] = useState('undefined');

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/currentUser');
        console.log("res")
        console.log(response.data)
        if (response.data === 'undefined') {
          setCurrentUser(undefined);
          localStorage.removeItem("currentUser")
        } else {
          setCurrentUser(response.data);
          localStorage.setItem("currentUser", response.data._id)
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, [])
  
  return (
    <div className='app'>
      <Router>
        {currentUser ? <LoggedInNavbar /> : <Navbar />}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loginsignup" element={<LoginSignup />} />
          <Route path="/categories/cafes" element={<Cafes />} />
          <Route path="/categories/restaurants" element={<Restaurants />} />
          <Route path="/categories/residence-halls" element={<Residence />} />
          <Route path="/categories/study-spots" element={<Study />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route exact path="/places/:id" element={<Place />} />
          <Route path="/blog-post" element={<BlogPost />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;