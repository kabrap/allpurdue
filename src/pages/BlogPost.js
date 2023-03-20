import React from 'react'
import './BlogPost.css'

function BlogPost() {
  return (
    <div className='blog-post'>
        <div className='category-date'>
            <p id='category-blog'>Food</p>
            <p id='date-blog'>5 March 2023</p>
        </div>
        <h1>Top 5 Restaurants on Campus</h1>
        <p id='body'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  )
}

export default BlogPost