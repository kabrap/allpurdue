import './Home.css'
import React, { useEffect, useState } from 'react'
import Search from '../components/search/Search.js'
import Card from '../components/card/Card.js'
import bellTower from '../images/bell-tower.gif'
import axios from 'axios'
import { Link } from 'react-router-dom'
import BlogCard from '../components/card/BlogCard'

function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/currentUser');
        setCurrentUser(response.data);
        console.log(response.data)
        if (response.data === 'undefined') {
          localStorage.removeItem("currentUser")
        } else {
          localStorage.setItem("currentUser", response.data._id)
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();

    axios.get('http://localhost:3000/recent-reviews')
      .then(response => {
        console.log(response.data)

        setRecentReviews(response.data)
      })
      .catch(error => console.log(error));

    axios.get('http://localhost:3000/recent-blogs')
      .then(response => {
        console.log("recent blog check")
        console.log(response.data)

        setRecentBlogs(response.data)
      })
      .catch(error => console.log(error));
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  const getAuthorName = (blog) => {
    const author = users.find(user => user._id === blog.author);
    return author ? author.name : '';
  }

  return (
    <div>
        <div className='hero'>
        <div id="hero-col-left" className='col'>
          <p id="hero-heading">Find all the <br /> best places at</p>
          <p id="hero-purdue">Purdue</p>
          <p id="hero-desc">
            Whether it be a food place, a residence hall,
            or a study spot at Purdue, AllPurdue features
            a wide variety of locations in different categories
            containing ratings and reviews made by
            Boilermakers, as well as visitors and locals.
          </p>
          <Search />
        </div>
        <div id="hero-image" className='col'>
          <img id="bellTower" src={bellTower} alt="bell tower" />
        </div>
      </div>
      <hr />
      <div className='reviews'>
        <h1>Recent Reviews</h1>
        <div className='reviews-container'>
          {recentReviews.slice(0, 6).map(review => (
            <Link key={review._id} to={`/places/${review.place._id}`} >
              <Card 
                text={review.text} 
                name={review.place.name} 
                tags={review.place.tags}
                rating={review.rating}
                placeType={review.place.placeType}
                imageUrl={review.place.images[0]}
              />
            </Link>
          ))}
        </div>
      </div>
      <hr />
      <div className='recent-blogs'>
        <h1>Recent Blogs</h1>
        <div className='recent-blogs-container'>
          {console.log("here")}
          {console.log(recentBlogs)}
          {recentBlogs.slice(0, 6).map(blog => (
            <div className='blogs-card-container' id='recent-blog-card'>
              <BlogCard 
                key={blog._id}
                _id = {blog._id}
                title={blog.title}
                text={blog.text}
                tags={blog.tags}
                date={formatDate(blog.createdAt)}
                author={getAuthorName(blog)}
                images={blog.images}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home