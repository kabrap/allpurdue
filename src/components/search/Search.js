import './Search.css';
import React, { useState } from 'react'
import search from '../../images/search.png'

function Search(props) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(searchQuery)
    // props.onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className='search-bar'>
        <img src={search} alt="search icon" onClick={handleSubmit}/>
        <input type="text" value={searchQuery} onChange={handleInputChange} placeholder="Chinese food..." />
    </form>
  )
}

export default Search