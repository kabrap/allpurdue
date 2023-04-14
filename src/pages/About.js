import React, {useState, useEffect} from 'react'
import axios from 'axios';

function About() {
  const [places, setPlaces] = useState([])
  const [blogs, setBlogs] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const placesData = await axios.get('http://localhost:3000/places');
        setPlaces(placesData.data);
        console.log(placesData.data.length)
        const reviewsData = await axios.get('http://localhost:3000/recent-reviews');
        setReviews(reviewsData.data)
        console.log(reviewsData)
        const blogsData = await axios.get('http://localhost:3000/blogs');
        console.log(blogsData.data)
        setBlogs(blogsData.data)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div>
      <br />
      <br />
      Individual review services like Yelp and Google exist where you can look up places and reviews, but there is no centralized platform that is tailored for Boilermakers; AllPurdue solves this problem by providing a convenient, streamlined platform acting as a one-stop service, optimized for the people and visitors of Purdue. 
      <br />
      <br />
      Whether it be a food place, a residence hall, or a study spot at Purdue, AllPurdue would have a wide variety of locations in different categories containing ratings and reviews made by Boilermakers, as well as visitors and locals. Users can also create blog posts talking about their experiences at various places, helping others in their search for a place to eat, live or study.
      <div className='stats-container'>
        <p>Number of places: {places.length}</p>
        <p>Number of reviews: {reviews.length}</p>
        <p>Number of blogs: {blogs.length}</p>
      </div>
    </div>
  )
}

export default About