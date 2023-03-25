import React, { useState } from 'react';
import './BlogCard.css';
import { Link } from 'react-router-dom';

const BlogCard = (props) => {
  return (
    <Link key={props._id} to={`/blogs/${props._id}`}>
        <div className="blog-card-container">
            <div className='blog-card-tags-container'>
                {props.tags.slice(0, 3).map(tag => (
                    <span className='blog-card-tag'>{tag} </span>
                ))}
                <span className='blog-card-date'>&#183; Posted by {props.author} {props.date}</span>
            </div>
            <span className="blog-card-title">{props.title}</span>
            <span className="blog-card-content">{props.text}</span>
            <div className='blog-card-images'>
              {props.images.map((image, index) => (
                <img key={index} src={`http://localhost:3000/${image}`} alt='' className='blog-card-image'/>
              ))}
            </div>
        </div>
    </Link>
  );
};

export default BlogCard;