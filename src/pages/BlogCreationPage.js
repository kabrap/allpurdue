import React, { useState } from "react";

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
      <h2>Create a Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" id="title" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          <label>Content:</label>
          <textarea id="content" value={content} onChange={handleContentChange} />
        </div>
        <div>
          <label>Pictures:</label>
          <input type="file" id="pictures" onChange={handlePictureChange} multiple />
        </div>
        <div className="picture-preview-container">
            {pictures.map((picture, index) => (
                <div key={index} className="picture-preview">
                    <button type="button" onClick={() => handlePictureDelete(index)} className="picture-delete-button">
                        <img src={URL.createObjectURL(picture)} alt={`Preview ${index}`} style={{ maxWidth: "200px", maxHeight: "200px", margin: "10px" }} className="picture-preview-image" />
                    </button>
                </div>
            ))}
        </div>
        <button type="submit">Create Blog Post</button>
      </form>
    </div>
  );
}

export default BlogCreationPage;