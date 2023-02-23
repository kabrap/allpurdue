import './Home.css'
import React from 'react'
import Search from '../components/search/Search.js'
import Card from '../components/card/Card.js'
import bellTower from '../images/bell-tower.gif'

function Home() {
  if (sessionStorage.getItem('isLogin') !== null && sessionStorage.getItem('isLogin') === 'true') {
    console.log("logged in home")
    const element = document.createElement('h1')
    const text = document.createTextNode("test login thing")
    // element.appendChild(document.createTextNode("test login thing"))
    element.appendChild(text)
    const element2 = document.getElementById('hero-desc')
    element2.appendChild(element)
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
          <Card />
          <Card />
        </div>
      </div>
    </div>
  )
}

export default Home