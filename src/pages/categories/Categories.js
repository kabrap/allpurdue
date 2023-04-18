import React, {useEffect, useState} from 'react'
import CategoryCard from '../../components/card/CategoryCard.js'
import './Categories.css'
import { Link } from 'react-router-dom';
import axios from 'axios'

function Categories() {
  const [places, setPlaces] = useState([])
  const [trending, setTrending] = useState([])
  const [displayTrending, setDisplayTrending] = useState(false)
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false);

  const handleTrendingClick = () => {
    setDisplayTrending(!displayTrending)
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/places');
        const trendingData = await axios.get('http://localhost:3000/trending-places');
        console.log(response.data)
        console.log("Trending here")
        console.log(trendingData.data)
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
      <button className={showTags === true ? 'showtags' : ''} onClick={() => { setShowTags(!showTags); setSelectedTags([]) }}>Filter by tags</button>
        {showTags && (
          <div className="tag-selector">
            <button className={isTagSelected('Wi-Fi') ? 'selected' : ''} onClick={() => handleTagSelection('Wi-Fi')}>Wi-Fi</button>
          </div>
        )}
      <div className='sorting-container'>
        <span id='all-places'>All Places {displayTrending ? '>' : ''} {displayTrending ? 'Trending' : ''}</span>
        <button className="fire-button" onClick={handleTrendingClick}>
          Trending
        </button>
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