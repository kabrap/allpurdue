import './Search.css';
import React from 'react'
import search from '../../images/search.png'

function Search() {
  return (
    <div className='search-bar'>
        <div className='inside'>
            <img src={search} alt="search icon" />
            <p>Chinese food...</p>
        </div>
    </div>
  )
}

export default Search