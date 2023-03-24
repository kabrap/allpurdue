import React from 'react'
import './BlogPost.css'
import bookmark from '../images/bookmark.png'
import share from '../images/shareicon.png'

function BlogPost() {
  return (
    <div className='blog-post'>
                <div className='blog-options'>
            <button
              id="blog-up-arrow"
              style={{
                cursor: "pointer",
                color: 'white',
                display: "flex",
                flexDirection: "column",
              }}
            >
            <span>&#8679;</span>
            <span id="review-likes">0</span>
            </button>
            <img className='blog-post-icon' src={bookmark}></img>
            <img className='blog-post-icon' src={share}></img>
          </div>
        <div className='blog-info-container'>
          <div className='category-date'>
            <p id='category-blog'>Food</p>
            <p id='date-blog'>5 March 2023</p>
            <p id='date-blog'>John Doe</p>
          </div>

        </div>
        <h1>Top 5 Restaurants on Campus</h1>
        <p id='body'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  )
}

export default BlogPost