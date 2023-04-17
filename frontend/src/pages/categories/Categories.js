import React, {useEffect, useState} from 'react'
import CategoryCard from '../../components/card/CategoryCard.js'
import './Categories.css'
import { Link } from 'react-router-dom';
import axios from 'axios'

function Categories() {
  const [places, setPlaces] = useState([])
  const [filterButton, setFilterButton] = useState(false)
  const [trending, setTrending] = useState([])
  const [priceFilter, setPriceFilter] = useState([])
  const [priceFilterTrending, setPriceFilterTrending] = useState([])
  const [displayTrending, setDisplayTrending] = useState(false)
  const [lowFilterValue, setLowFilterValue] = useState('')
  const [highFilterValue, setHighFilterValue] = useState('')

  const handleFilterButton = () => {
    setFilterButton(!filterButton)
  }

  const handleTrendingClick = () => {
    setDisplayTrending(!displayTrending)
  };

  const clearFields = () => {
    setLowFilterValue('');
    setHighFilterValue('');
    setFilterButton(false)
  }
  
  const handleLowFilterValue = (e) => {
    setLowFilterValue(e.target.value)
    if (e.target.value < 0) {
      setLowFilterValue(0);
    }
    if (highFilterValue == '' || parseInt(e.target.value) > parseInt(highFilterValue)) {
      setHighFilterValue(e.target.value);
    }
  }

  const handleHighFilterValue = (e) => {
    console.log(e.target.value)
    setHighFilterValue(e.target.value)
    if (parseInt(e.target.value) < 0) {
      setHighFilterValue(0)
    }
    if (parseInt(e.target.value) < parseInt(lowFilterValue)) {
      if (parseInt(e.target.value) >= 0) {
        setLowFilterValue(e.target.value);
      } else {
        setLowFilterValue(0)
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/places');
        const trendingData = await axios.get('http://localhost:3000/trending-places');
        console.log(response.data)
        console.log("Trending here")
        console.log(trendingData.data)
        setPlaces(response.data);
        setTrending(trendingData.data);
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
      {filterButton &&
        <div className='filter-form'>
          <form className="filter-form-inputs">
            <label>From </label>
            <input type="number" placeholder="8" value={lowFilterValue} onChange={handleLowFilterValue}></input>
            <br/>
            <label>To &nbsp;&nbsp;&nbsp;&nbsp;</label>
            <input type="number" placeholder="25" value={highFilterValue} onChange={handleHighFilterValue}></input>
          </form>
        </div>
      }
      <div className='sorting-container'>
        <span id='all-places'>All Places {displayTrending ? '>' : ''} {displayTrending ? 'Trending' : ''}</span>
        <div className='filter-button-container'>
          {lowFilterValue + highFilterValue != '' &&
            <div>
              <button className='price-filter-button' onClick={clearFields}>Clear Filter</button>
            </div>
          }
          <button className='price-filter-button' onClick={handleFilterButton}>
            Price Filter
          </button>
          <button className="fire-button" onClick={handleTrendingClick}>
            Trending
          </button>
        </div>
      </div>
      <div className='categories-cards'>
        {!displayTrending && places.map(place => (
          <CategoryCard 
            key={place._id}
            title={place.name}
            description={place.description}
            tags={place.tags}
            placeType={place.placeType}
            avgRating={place.avgRating}
            image={place.images[0]}
            _id={place._id}
          />
        ))}
        {displayTrending && trending.map(place => (
          <CategoryCard 
            key={place._id}
            title={place.name}
            description={place.description}
            tags={place.tags}
            placeType={place.placeType}
            avgRating={place.avgRating}
            image={place.images[0]}
            _id={place._id}
          />
        ))}
      </div>
    </div>
  )
}

export default Categories