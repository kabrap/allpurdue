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
  const [featuredBlog, setFeaturedBlog] = useState(null)
  const [featuredPlace, setFeaturedPlace] = useState(null)

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
        setRecentReviews(response.data)
      })
      .catch(error => console.log(error));

    axios.get('http://localhost:3000/recent-blogs')
      .then(response => {
        setRecentBlogs(response.data)
      })
      .catch(error => console.log(error));

      axios.get('http://localhost:3000/featured')
      .then(response => {
        if (response.data.blog) {
          setFeaturedBlog(response.data.blog)
        } else {
          setFeaturedPlace(response.data.place)
        }
        console.log(response.data)
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

  const exploreBlogs = () => {
    window.location.href = `/blogs`
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
      <div className='featured'>
        <div id="hero-image"  className='col'>
          {featuredPlace && 
            <div className='featured-place-card'>
              <div className='featured-card-content'>
                <div className='featured-heading'>
                  <h1>{featuredPlace.name}</h1>
                  <p><span className="stars">&#9733;</span><span className="rating-number-recent-review">&#40;{featuredPlace.averageRating}&#41;</span></p>
                </div>
                <div className='tags-container'>
                  {featuredPlace.tags.slice(0, 3).map(tag => (
                    <span id='tag-recent'>{tag}</span>
                  ))}
                </div>
                <p>{featuredPlace.address}</p>
                <p>{featuredPlace.description}</p>
                <img src={featuredPlace.images[0]}></img>
              </div>
            </div>
          }
          {featuredBlog && 
            <div className='featured-place-card'>
              <div className='featured-card-content'>
                <h1>{featuredBlog.title}</h1>
                <div className='tags-container'>
                  {featuredBlog.tags.map(tag => (
                    <span id='tag-recent'>{tag}</span>
                  ))}
                </div>
                <p>{featuredBlog.text}</p>
                {featuredBlog.images[0] && <img src={featuredBlog.images[0]}></img>}
              </div>
            </div>
          }
        </div>
        <div id="hero-col-right" className='col'>
          <p id="hero-heading">Check out the</p>
          <p id="hero-heading-2">featured <span id="featured-sub">{featuredPlace ? 'Place' : 'Blog'}</span></p>
          <p id="hero-heading-3">of the week!</p>
          <p id="hero-desc">
            Each week, our team at AllPurdue carefully selects one outstanding place or blog to showcase on our homepage.
            We highlight the best of the best, curating a collection of the most impressive places and insightful blog posts that our site has to offer.
            Whether you're looking for hidden gems or different perspectives, our weekly features are guaranteed to spur your imagination.
          </p>
        </div>
      </div>
      <hr />
      <div className='recent-blogs'>
        <div className='recent-blog-heading'>
          <h1>Explore recent <span id='explore-blog-arrow' onClick={exploreBlogs}>&#10140;</span></h1>
          <h1 id='subheading'>blogs by <span>Boilermakers</span></h1>
        </div>
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