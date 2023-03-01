import './Search.css';
import React, { useState } from 'react'
import search from '../../images/search.png'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Chipotle from '../../images/chipotle.jpg'

function Search(props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = async (e) => {
    setSearchQuery(e.target.value);

    try {
      const response = await axios.post('http://localhost:3000/search', { query: e.target.value });
      console.log(response.data);
      setSearchResults(response.data);
      setShowResults(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(searchQuery);
  
    try {
      const response = await axios.post('http://localhost:3000/search', { query: searchQuery });
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='search-bar'>
        <img src={search} alt="search icon" onClick={handleSubmit}/>
        <input type="text" value={searchQuery} onChange={handleInputChange} placeholder="Chinese food..."/>
      </form>

      {/* Dropdown */}
      {showResults && searchQuery.length >= 1 && (
        <div className='dropdown'>
          {searchResults.map(result => (
            <Link key={result._id} to={`/places/${result._id}`}>
              <div className='search-result'>
                  <img src={Chipotle} alt='place img'></img>
                  <p>{result.name}</p>
                  <p>({result.placeType})</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>

  )
}

export default Search