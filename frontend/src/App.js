import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import LoggedInNavbar from './components/navbar/LoggedInNavbar';
import React, {useEffect, useState} from 'react'
import Home from './pages/Home'
import About from './pages/About'
import AddLocation from './pages/AddLocation'
import Categories from './pages/categories/Categories';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import LoginSignup from './pages/LoginSignup';
import Cafes from './pages/categories/Cafes'
import Restaurants from './pages/categories/Restaurants'
import Residence from './pages/categories/Residence'
import Study from './pages/categories/Study'
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard'
import Place from './pages/Place'
import EditPlace from './pages/EditPlace'
import axios from 'axios';
import BlogPost from './pages/BlogPost';
import BlogCreationPage from './pages/BlogCreationPage';

function App() {
  const [currentUser, setCurrentUser] = useState('undefined');

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/currentUser');
        // console.log(response.data)
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
          <Route path="/add-location" element={<AddLocation />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/loginsignup" element={<LoginSignup />} />
          <Route path="/categories/cafes" element={<Cafes />} />
          <Route path="/categories/restaurants" element={<Restaurants />} />
          <Route path="/categories/residence-halls" element={<Residence />} />
          <Route path="/categories/study-spots" element={<Study />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route exact path="/places/:id" element={<Place />} />
          <Route exact path="edit-place/:d" element={<EditPlace />} />
          <Route path="/blogs/:id" element={<BlogPost />} />
          <Route path="/blogs/create" element={<BlogCreationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;