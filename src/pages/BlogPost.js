import React, {useEffect, useState} from 'react'
import './BlogPost.css'
import bookmark from '../images/bookmark.png'
import share from '../images/shareicon.png'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function BlogPost() {
  const { id } = useParams();
  const [authorId, setAuthorId] = useState('')
  const [blogId, setBlogId] = useState('')
  const [author, setAuthor] = useState('')
  const [tags, setTags] = useState([''])
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [blogImages, setBlogImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState(null)

  const handlePrevClick = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? blogImages.length - 1 : currentImageIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex(
      currentImageIndex === blogImages.length - 1 ? 0 : currentImageIndex + 1
    );
  };
  function handleImageClick() {
    setIsExpanded(!isExpanded);
  }

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await axios.get(`http://localhost:3000/blogs/${id}`);
        const { _id, author, authorName, title, text, createdAt, tags, likes, likes_by, images } = response.data;
        console.log(response.data)
        setAuthorId(author);
        setAuthor(authorName);
        setBlogId(_id);
        setTags(tags);
        setTitle(title);
        setText(text);
        setLikes(likes);
        setBlogImages(images)
        const createdDate = new Date(createdAt);
        const formattedDate = createdDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        setDate(formattedDate);
        if (likes_by.includes(localStorage.getItem('currentUser'))) {
          setLiked(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchBlog();

    axios.get('http://localhost:3000/users/')
    .then(response => {
      setUser(response.data.find(user => user._id === localStorage.getItem("currentUser")));
    })
    .catch(error => console.log(error));
  }, [id]);

  const handleBookmark = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/save-blog/${blogId}`);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }

      axios.get('http://localhost:3000/users/')
      .then(response => {
        setUser(response.data.find(user => user._id === localStorage.getItem("currentUser")));
      })
      .catch(error => console.log(error));
  }

  const handleShare = () => {

  }

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/blogs/${blogId}/like/${authorId}`);
      setLikes(response.data.likes)
      setLiked(!liked)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='blog-post'>
        <div className='blog-options'>
          <button
            onClick={handleLike}
            id="blog-up-arrow"
            style={{
              ...liked ? {color: '#ffcf56'} : {color: 'white'},
              pointerEvents: localStorage.getItem("currentUser") ? "auto" : "none",
              opacity: localStorage.getItem("currentUser") ? 1 : 0.5,
            }}
            disabled={!localStorage.getItem("currentUser")}
            title={!localStorage.getItem("currentUser") ? "Please log in to like" : ""}
          >
            <span>&#8679;</span>
            <span id="review-likes">{likes}</span>
          </button>
          {user && <span onClick={handleBookmark} className={user.savedBlogs && user.savedBlogs.includes(blogId) ? 'favorite-icon red' : 'favorite-icon'}>&#x2764;</span>}
          <img className='blog-post-icon' src={share}></img>
        </div>
        <div className='blog-info-container'>
          <div className='category-date'>
            {tags.map(tag => <p id='category-blog'>{tag}</p>)}
            <p id='date-blog'>{date}</p>
            <p id='date-blog'>{author}</p>
          </div>
        </div>
        <h1>{title}</h1>
        <p id='body'>{text}</p>
        {blogImages.length > 0 && 
          <div className="image-carousel">
            <div className="place-image">
              <img
                src={`http://localhost:3000/${blogImages[currentImageIndex]}`}
                alt="place"
                id="place-img"
                onClick={handleImageClick}
              />
              {isExpanded && (
                <div className="expanded-image-overlay" onClick={handleImageClick}>
                  <img src={`http://localhost:3000/${blogImages[currentImageIndex]}`} alt="place" id="expanded-place-img" />
                </div>
              )}
              {!isExpanded && (
                <div>
                  <button className="prev" onClick={handlePrevClick}>
                    &#8249;
                  </button>
                  <button className="next" onClick={handleNextClick}>
                    &#8250;
                  </button>
                </div>
              )}
            </div>
          </div>
        }
    </div>
  )
}

export default BlogPost