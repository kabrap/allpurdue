import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import BlogCard from '../components/card/BlogCard'
import "./Blogs.css"
import Delete from '../images/delete.png'


function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortOption, setSortOption] = useState("new");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTags, setShowTags] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect( () => {
    axios.get('http://localhost:3000/verify-admin')
    .then(response => {
      console.log(response.data)
      setIsAdmin(true)
    })
    .catch(error => console.log(error));
  }, [isAdmin])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/blogs');
        let sortedData = response.data;
        if (sortOption === "new") {
          sortedData = sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortOption === "top") {
          sortedData = sortedData.sort((a, b) => b.likes - a.likes);
        }
        if (selectedTags.length > 0) {
          sortedData = sortedData.filter(blog => {
            return selectedTags.every(tag => blog.tags.includes(tag));
          });
        }
        setBlogs(sortedData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [sortOption, selectedTags]);

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
      const response = await axios.get('http://localhost:3000/blogs');
      let sortedData = response.data;
      if (sortOption === "new") {
        sortedData = sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === "top") {
        sortedData = sortedData.sort((a, b) => b.likes - a.likes);
      }
      if (selectedTags.length > 0) {
        sortedData = sortedData.filter(blog => {
          return selectedTags.every(tag => blog.tags.includes(tag));
        });
      }
      setBlogs(sortedData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/blogs/${blogId}`);
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await axios.get('http://localhost:3000/blogs');
      let sortedData = response.data;
      if (sortOption === "new") {
        sortedData = sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === "top") {
        sortedData = sortedData.sort((a, b) => b.likes - a.likes);
      }
      if (selectedTags.length > 0) {
        sortedData = sortedData.filter(blog => {
          return selectedTags.every(tag => blog.tags.includes(tag));
        });
      }
      setBlogs(sortedData);
    } catch (error) {
      console.error(error);
    }
  }

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
    <div className='blogs-page-container'>
      <h1 className='blogs-page-header'>Browse All Blogs</h1>
      <div className='create-blog-container'>
        <Link to="/blogs/create">
          <button>Create Blog Post</button>
        </Link>
      </div>
      <div className="blogs-button-container">
        <button className={sortOption === 'new' ? 'selected' : ''} onClick={() => setSortOption("new")}>New</button>
        <button className={sortOption === 'top' ? 'selected' : ''} onClick={() => setSortOption("top")}>Top</button>
        <button className={showTags === true ? 'showtags' : ''} onClick={() => { setShowTags(!showTags); setSelectedTags([]) }}>Filter by tags</button>
        {showTags && (
          <div className="tag-selector">
            <button className={isTagSelected('Cafes') ? 'selected' : ''} onClick={() => handleTagSelection('Cafes')}>Cafes</button>
            <button className={isTagSelected('Restaurants') ? 'selected' : ''} onClick={() => handleTagSelection('Restaurants')}>Restaurants</button>
            <button className={isTagSelected('Residence Halls') ? 'selected' : ''} onClick={() => handleTagSelection('Residence Halls')}>Residence Halls</button>
            <button className={isTagSelected('Study Spots') ? 'selected' : ''} onClick={() => handleTagSelection('Study Spots')}>Study Spots</button>
          </div>
        )}
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
                disabled={localStorage.getItem("currentUser") === "undefined"}
                title={localStorage.getItem("currentUser") === "undefined" ? "Please log in to like" : ""}
              >
                <span>&#8679;</span>
                <span id="blog-likes">{blog.likes}</span>
              </button>
              {isAdmin && <img className="dashboard-delete-icon" id='blogs-page-delete' src={Delete} alt="delete icon" onClick={() => handleDelete(blog._id)}/>}
              <BlogCard 
                key={blog._id}
                _id = {blog._id}
                title={blog.title}
                text={blog.text}
                tags={blog.tags}
                date={formatDate(blog.createdAt)}
                author={getAuthorName(blog)}
                images={blog.images}
              />
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Blogs