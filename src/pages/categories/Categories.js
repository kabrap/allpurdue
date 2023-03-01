import React, {useEffect, useState} from 'react'
import CategoryCard from '../../components/card/CategoryCard.js'
import './Categories.css'
import { Link } from 'react-router-dom';
import axios from 'axios'

function Categories() {
  const [places, setPlaces] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/places');
        console.log(response.data)
        setPlaces(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {console.log(places)}
      <div className='browse'>
        <h1>Browse All Categories</h1>
      </div>
      <div className="filter-bar">
        <Link to='/categories/cafes'><button id='left-filter' className='filter-button'>Cafes</button></Link>
        <Link to='/categories/restaurants'><button className='filter-button'>Restaurants</button></Link>
        <Link to='/categories/residence-halls'><button className='filter-button'>Residence Halls</button></Link>
        <Link to='/categories/study-spots'><button id='right-filter' className='filter-button'>Study Spots</button></Link>
      </div>
      <div className='sorting-container'>
        <span id='all-places'>All Places</span>
        {/* <span>Sort: <b>Recommended</b>&#8595;</span> */}
      </div>
      <div className='categories-cards'>
        {places.map(place => (
          <CategoryCard 
            key={place._id}
            title={place.name}
            description={place.description}
            tags={place.tags}
            placeType={place.placeType}
            avgRating={place.avgRating}
            _id={place._id}
          />
        ))}
      </div>
    </div>
  )
}

export default Categories