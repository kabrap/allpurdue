import React, {useEffect, useState} from 'react'
import './BlogPost.css'
import share from '../images/shareicon.png'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Delete from '../images/delete.png'
import ConfirmationDialog from '../components/ConfirmationDialog';
import ConfirmationReport from '../components/ConfirmationReport';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [user, setUser] = useState({})
  const [isAdmin, setIsAdmin] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showBlogConfirmationDialog, setShowBlogConfirmationDialog] = useState(false);
  const [showConfirmationReport, setShowConfirmationReport] = useState(false);

  useEffect( () => {
    axios.get('http://localhost:3000/verify-admin')
    .then(response => {
      console.log(response.data)
      setIsAdmin(true)
    })
    .catch(error => console.log(error));
  }, [isAdmin])

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

  const handleDelete = async () => {
    setShowConfirmationDialog(false);
    try {
      const response = await axios.delete(`http://localhost:3000/blogs/${blogId}`);
      window.location.href = `/blogs`
    } catch (error) {
      console.log(error);
    }
  }

  const handleConfirmDelete = () => {
    setShowConfirmationDialog(true);
  }

  const handleCancelDelete = () => {
    setShowConfirmationDialog(false);
  }

  const handleConfirmReport = () => {
    setShowConfirmationReport(true);
  }

  const handleCancelReport = () => {
    setShowConfirmationReport(false);
  }

  const handleReport = async (blogId) => {
    let userId = authorId;
    console.log(blogId)
    console.log(userId)
    toast.success("Blog reported", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    try {
      const response = await axios.post('http://localhost:3000/blog/report', { blogId, userId });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setShowConfirmationReport(false);
  };

  const handleFeatureBlog = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/feature-blog/${blogId}`);
      toast.success(
        <div className="toast-container">
          Blog is now featured!
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

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
            disabled={localStorage.getItem("currentUser") === "undefined"}
            title={localStorage.getItem("currentUser") === "undefined" ? "Please log in to like" : ""}
          >
            <span>&#8679;</span>
            <span id="review-likes">{likes}</span>
          </button>
          <div className='more-blog-options'>
            {user && (<span onClick={handleBookmark} className={user.savedBlogs && user.savedBlogs.includes(blogId) ? 'favorite-icon red' : 'favorite-icon'}>&#x2764;</span>)}
            {localStorage.getItem("currentUser") !== "undefined"  && <span className='flag-icon' onClick={handleConfirmReport}>&#9873;</span>}
            {localStorage.getItem("currentUser") === authorId || isAdmin ? (
              <img className="dashboard-delete-icon" src={Delete} alt="delete icon" onClick={handleConfirmDelete}/>
            ) : null}
          </div>
          <ConfirmationReport
            open={showConfirmationReport}
            onClose={handleCancelReport}
            onConfirm={() => handleReport(blogId)}
            message="Are you sure you want to report this blog?"
          />
          <ConfirmationDialog
            open={showConfirmationDialog}
            onClose={handleCancelDelete}
            onConfirm={() => handleDelete()}
            message="Are you sure you want to delete this blog post?"
          />
        </div>
        <div className='blog-info-container'>
          <div className='category-date'>
            {tags.map(tag => <p id='category-blog'>{tag}</p>)}
            <p id='date-blog'>{date}</p>
            <p id='date-blog'>{author}</p>
            {isAdmin &&
              <button className="feature-button" onClick={handleFeatureBlog}>Feature</button>
            }
          </div>
        </div>
        <h1>{title}</h1>
        <p id='body'>{text}</p>
        <div className="image-wrapper">
          {blogImages.length > 0 && 
            blogImages.map((blogImage, index) => (
              index % 3 === 0 ? 
                <div className="image-row" key={index}>
                  <img className='blog-post-page-image' src={`http://localhost:3000/${blogImages[index]}`} />
                  {blogImages[index + 1] &&
                    <img className='blog-post-page-image' src={`http://localhost:3000/${blogImages[index + 1]}`} />
                  }
                  {blogImages[index + 2] &&
                    <img className='blog-post-page-image' src={`http://localhost:3000/${blogImages[index + 2]}`} />
                  }
                </div> 
              : null
            ))
          }
        </div>
        <ToastContainer />
    </div>
  )
}

export default BlogPost