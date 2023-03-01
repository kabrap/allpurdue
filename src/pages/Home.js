import './Home.css'
import React, { useEffect, useState } from 'react'
import Search from '../components/search/Search.js'
import Card from '../components/card/Card.js'
import bellTower from '../images/bell-tower.gif'
import axios from 'axios'

function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [recentReviews, setRecentReviews] = useState([])

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
  }, []);

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
          {recentReviews.map(review => (
            <Card 
              key={review._id}
              placeId={review.place._id} 
              text={review.text} 
              name={review.place.name} 
              tags={review.place.tags}
              rating={review.rating}
              placeType={review.place.placeType}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home