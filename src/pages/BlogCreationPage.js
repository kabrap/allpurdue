import React, { useState } from "react";
import "./BlogCreationPage.css"
import { Link } from 'react-router-dom';
import AddImage from '../images/addimgicon.png'

function BlogCreationPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pictures, setPictures] = useState([]);

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
  };

  const handlePictureDelete = (index) => {
    const newPictures = [...pictures];
    newPictures.splice(index, 1);
    setPictures(newPictures);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(title, content, pictures);
    setTitle("");
    setContent("");
    setPictures([]);
  };

  return (
    <div>
      <Link to='/blog'>&#8617; Blogs</Link>
      <h2 className="blog-page-title">Create a Blog Post</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <label>Title:</label>
        <input type="text" id="title" value={title} onChange={handleTitleChange} placeholder="Enter a title for your blog post..."/>
        <label>Content:</label>
        <textarea id="content" value={content} onChange={handleContentChange} placeholder="Type up your blog here"/>
        <div className="picture-preview-container">
            {pictures.map((picture, index) => (
                <img src={URL.createObjectURL(picture)} alt={`Preview ${index}`} onClick={() => handlePictureDelete(index)} className="picture-preview-image" />
            ))}
        </div>
        <div className="button-container">
            <div className="add-pic-container">
                <label for="pictures">
                    <img src={AddImage} alt="add icon"/>
                </label>
                <input type="file" id="pictures" onChange={handlePictureChange} multiple />
            </div>
            <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
}

export default BlogCreationPage;