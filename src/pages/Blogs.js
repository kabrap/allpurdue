import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import BlogCard from '../components/card/BlogCard'
import "./Blogs.css"

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/blogs');
        console.log(response.data)
        setBlogs(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3000/users/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  const getAuthorName = (blog) => {
    const author = users.find(user => user._id === blog.author);
    return author ? author.name : '';
  }

  const handleLike = async (blogId) => {
    try {
      const response = await axios.post(`http://localhost:3000/blogs/${blogId}/like/${localStorage.getItem("currentUser")}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get(`http://localhost:3000/blogs/`);
      setBlogs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='blogs-page-container'>
      <h1 className='blogs-page-header'>Browse All Blogs</h1>
      <div className='create-blog-container'>
        <Link to="/blogs/create">
          <button>Create Blog Post</button>
        </Link>
      </div>
      <div className='blogs-button-container'>
        <button>New</button>
        <button>Top</button>
      </div>
      <div className='blog-cards'>
        {blogs.map(blog => {
          const user = users.find(user => user._id === blog.author);
          let arrowColor = 'white';

          if (blog.likes_by.includes(localStorage.getItem("currentUser"))) {
            arrowColor = '#FFC632';
          }
          return (
            <div className='blogs-card-container'>
              <button
                style={{
                  cursor: "pointer",
                  color: arrowColor,
                  pointerEvents: localStorage.getItem("currentUser") ? "auto" : "none",
                  opacity: localStorage.getItem("currentUser") ? 1 : 0.5,
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => handleLike(blog._id)}
                disabled={!localStorage.getItem("currentUser")}
                title={!localStorage.getItem("currentUser") ? "Please log in to like" : ""}
              >
                <span>&#8679;</span>
                <span id="blog-likes">{blog.likes}</span>
              </button>
              <BlogCard 
                key={blog._id}
                title={blog.title}
                text={blog.text}
                tags={blog.tags}
                date={formatDate(blog.createdAt)}
                author={getAuthorName(blog)}
              />
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Blogs