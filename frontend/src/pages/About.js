import React, { useState, useEffect } from 'react';
import Blog from '../images/blog.png'
import Users from '../images/users.png'
import Review from '../images/review.png'
import './About.css'

function About() {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:3000/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3000/recent-reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <br />
      <br />
      Individual review services like Yelp and Google exist where you can look up places and reviews, but there is no centralized platform that is tailored for Boilermakers; AllPurdue solves this problem by providing a convenient, streamlined platform acting as a one-stop service, optimized for the people and visitors of Purdue. 
      <br />
      <br />
      Whether it be a food place, a residence hall, or a study spot at Purdue, AllPurdue would have a wide variety of locations in different categories containing ratings and reviews made by Boilermakers, as well as visitors and locals. Users can also create blog posts talking about their experiences at various places, helping others in their search for a place to eat, live or study.
      <div className='stats-container'>
        <div className='individual-stat-container'>
          <img id="blogs" src={Blog} alt="blogs img" />
          <span>{blogs.length} Blogs</span>
        </div>
        <div className='individual-stat-container'>
          <img id="users" src={Users} alt="users img" />
          <span>{users.length} Users</span>
        </div>
        <div className='individual-stat-container'>
          <img id="review" src={Review} alt="review img" />
          <span>{reviews.length} Reviews</span>
        </div>
      </div>
    </div>
  )
}

export default About