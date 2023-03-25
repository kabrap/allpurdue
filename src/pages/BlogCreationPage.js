import React, { useState } from "react";
import "./BlogCreationPage.css"
import { Link } from 'react-router-dom';
import AddImage from '../images/addimgicon.png'
import axios from 'axios'

function BlogCreationPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pictures, setPictures] = useState([]);
  const [tags, setTags] = useState([
    { name: "Cafes", selected: false },
    { name: "Restaurants", selected: false },
    { name: "Residence Halls", selected: false },
    { name: "Study Spots", selected: false },
  ]);
  const author = localStorage.getItem("currentUser");


  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePictureChange = (event) => {
    const files = event.target.files;
    const newPictures = Array.from(files);
    setPictures([...pictures, ...newPictures]);
    event.target.value = null;
  };
  

  const handlePictureDelete = (index) => {
    const newPictures = [...pictures];
    newPictures.splice(index, 1);
    setPictures(newPictures);
  };

  const handleTagClick = (index) => {
    const newTags = [...tags];
    newTags[index].selected = !newTags[index].selected;
    setTags(newTags);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const newBlog = {
      title,
      text: content,
      author: author,
      tags: tags.filter((tag) => tag.selected && tag.name).map((tag) => tag.name),
    };
  
    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('text', newBlog.text);
      formData.append('author', newBlog.author);
      newBlog.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });
      pictures.forEach(picture => {
        formData.append('blog-images', picture);
      });
  
      await axios.post('http://localhost:3000/blogs', formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Link to='/blogs'>&#8617; Blogs</Link>
      <h2 className="blog-page-title">Create a Blog Post</h2>
      <div className="form-container">
        <label>Title:</label>
        <input type="text" id="title" value={title} onChange={handleTitleChange} placeholder="Enter a title for your blog post..."/>
        <label>Tags:</label>
        <div className="tag-container">
          {tags.map((tag, index) => (
            <button key={index} type="button" className={`tag-button ${tag.selected ? "selected" : ""}`} onClick={() => handleTagClick(index)}>{tag.name}</button>
          ))}
        </div>
        <label>Content:</label>
        <textarea id="content" value={content} onChange={handleContentChange} placeholder="Type up your blog here"/>
        <div className="picture-preview-container">
          {pictures.map((picture, index) => (
            <img src={URL.createObjectURL(picture)} alt={`Preview ${index}`} onClick={() => handlePictureDelete(index)} className="picture-preview-image" />
          ))}
        </div>
        <div className="button-container">
          <div className="add-pic-container">
            <label htmlFor="pictures">
              <img src={AddImage} alt="add icon"/>
            </label>
            <input type="file" id="pictures" onChange={handlePictureChange} multiple />
          </div>
          <button  onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>
  );
}

export default BlogCreationPage;