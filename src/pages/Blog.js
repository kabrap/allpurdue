import React from "react";
import BlogCard from '../components/card/BlogCard'

function Blog() {
  return (
    <div>
      <BlogCard 
        likes="1"
        title="My top 5 study spots"
        author="bobjones"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
      />
    </div>
  );
}

export default Blog;
