import './Home.css'
import React, { useEffect, useState } from 'react'
import Search from '../components/search/Search.js'
import Card from '../components/card/Card.js'
import bellTower from '../images/bell-tower.gif'
import axios from 'axios'

function Home() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/currentUser');
        setCurrentUser(response.data);
        console.log(response.data)
        sessionStorage.setItem("currentUser", response.data._id)
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
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
          <Card />
          <Card />
        </div>
      </div>
    </div>
  )
}

export default Home