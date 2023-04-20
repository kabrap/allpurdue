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
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false);

  const handleTrendingClick = () => {
    handlePriceFilter(1,5,places,trending)
    setDisplayTrending(!displayTrending)
  };

  const clearFields = () => {
    setLowFilterValue(1);
    setHighFilterValue(5);
    setFilterButton(false)
    handlePriceFilter(1,5, places, trending)
  }
  
  const handleLowFilterValue = (e) => {
    let tempLowValue = e.target.value
    let tempHighValue = highFilterValue
    setLowFilterValue(e.target.value)
    if (e.target.value < 0) {
      setLowFilterValue(0);
      tempLowValue = 0
    }
    if (e.target.value > 5) {
      setLowFilterValue(5)
      tempLowValue = 0
    }
    if (parseInt(e.target.value) > parseInt(highFilterValue)) {
      setHighFilterValue(Math.min(5,e.target.value));
      tempHighValue = Math.min(5,e.target.value)
    }
    if (highFilterValue == '') {
      tempHighValue = 5
    }
    handlePriceFilter(tempLowValue, tempHighValue, places, trending)
  }

  const handleHighFilterValue = (e) => {
    let tempLowValue = lowFilterValue
    let tempHighValue = e.target.value
    setHighFilterValue(e.target.value)
    if (e.target.value > 5) {
      setHighFilterValue(5);
      tempHighValue = 5
    }
    if (parseInt(e.target.value) < 0) {
      setHighFilterValue(0)
      tempHighValue = 5
    }
    if (parseInt(e.target.value) < parseInt(lowFilterValue)) {
      if (parseInt(e.target.value) >= 0) {
        setLowFilterValue(e.target.value);
        tempLowValue = e.target.value
      } else {
        setLowFilterValue(0)
        tempLowValue = 0
      }
    }
    if (e.target.value == '') {
      tempHighValue = 5
    }
    handlePriceFilter(tempLowValue, tempHighValue, places, trending)
  }

  const handlePriceFilter = (low, high, currentPlaces, currentTrending) => {
    setPriceFilter(currentPlaces.filter(item => (item.price <= high && item.price >= low)));
    setPriceFilterTrending(currentTrending.filter(item => (item.price <= high && item.price >= low)));
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
        handlePriceFilter(1,5,response.data,trendingData.data)
        let sortedData = response.data;
        if (selectedTags.length > 0) {
          sortedData = sortedData.filter(place => {
            return selectedTags.every(tag => place.tags.includes(tag));
          });
        }
        setPlaces(sortedData);
        setTrending(trendingData.data)
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
          <button className='price-filter-button' onClick={() => { setShowTags(!showTags); setSelectedTags([]) }}>Filter by tags</button>
          <button className='price-filter-button' onClick={handleFilterButton}>
            Price Filter
          </button>
          <button className="fire-button" onClick={handleTrendingClick}>
            Trending
          </button>
        </div>
      </div>
      {showTags && (
        <div className="tag-selector">
          <button className={isTagSelected('Wi-Fi') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Wi-Fi')}>Wi-Fi</button>
          <button className={isTagSelected('Fast Food') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Fast Food')}>Fast Food</button>
          <button className={isTagSelected('Pizza') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Pizza')}>Pizza</button>
          <button className={isTagSelected('American') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('American')}>American</button>
          <button className={isTagSelected('Asian') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Asian')}>Asian</button>
          <button className={isTagSelected('Italian') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Italian')}>Italian</button>
          <button className={isTagSelected('Sushi') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Sushi')}>Sushi</button>
          <button className={isTagSelected('Japanese') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Japanese')}>Japanese</button>
          <button className={isTagSelected('Desserts') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Desserts')}>Desserts</button>
          <button className={isTagSelected('Burgers') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Burgers')}>Burgers</button>
          <button className={isTagSelected('Cookies') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Cookies')}>Cookies</button>
          <button className={isTagSelected('German') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('German')}>German</button>
          <button className={isTagSelected('Indian') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Indian')}>Indian</button>
          <button className={isTagSelected('Local') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Local')}>Local</button>
          <button className={isTagSelected('Tea') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Tea')}>Tea</button>
          <button className={isTagSelected('Coffee') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Coffee')}>Coffee</button>
          <button className={isTagSelected('Boba') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Boba')}>Boba</button>
          <button className={isTagSelected('Library') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Library')}>Library</button>
          <button className={isTagSelected('Printers') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Printers')}>Printers</button>
          <button className={isTagSelected('Study Spaces') ? 'tag-selected' : 'tag-not-selected'} onClick={() => handleTagSelection('Study Spaces')}>Study Spaces</button>
        </div>
      )}
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