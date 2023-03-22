import React from "react";
import "./BlogCard.css";

function BlogCard(props) {
    return (
        <div className="blog-card">
            <div className="blog-card-likes">{props.likes} likes</div>
            <div>
                <div className="blog-card-title">{props.title}</div>
                <div className="blog-card-author">Posted by {props.author}</div>
                <div className="blog-card-content">{props.content}</div>
            </div>
        </div>
    );
}

export default BlogCard;
