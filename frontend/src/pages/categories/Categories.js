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
<<<<<<< HEAD:frontend/src/pages/categories/Categories.js
  const [lowFilterValue, setLowFilterValue] = useState('')
  const [highFilterValue, setHighFilterValue] = useState('')

  const handleFilterButton = () => {
    setFilterButton(!filterButton)
  }
=======
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false);
>>>>>>> blog:src/pages/categories/Categories.js

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
<<<<<<< HEAD:frontend/src/pages/categories/Categories.js
        setPlaces(response.data);
        setTrending(trendingData.data);
=======
        let sortedData = response.data;
        if (selectedTags.length > 0) {
          sortedData = sortedData.filter(place => {
            return selectedTags.every(tag => place.tags.includes(tag));
          });
        }
        setPlaces(sortedData);
        setTrending(trendingData.data)
>>>>>>> blog:src/pages/categories/Categories.js
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [selectedTags]);

  const handleTagSelection = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const isTagSelected = tag => {
    return selectedTags.includes(tag);
  };

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
<<<<<<< HEAD:frontend/src/pages/categories/Categories.js
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
=======
      <button className={showTags === true ? 'showtags' : ''} onClick={() => { setShowTags(!showTags); setSelectedTags([]) }}>Filter by tags</button>
        {showTags && (
          <div className="tag-selector">
            <button className={isTagSelected('Wi-Fi') ? 'selected' : ''} onClick={() => handleTagSelection('Wi-Fi')}>Wi-Fi</button>
          </div>
        )}
>>>>>>> blog:src/pages/categories/Categories.js
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