import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ItemComponent from "./components/ItemComponent";
import PostAPI from "../../../api/postAPI";

function General() {
  const [posts, setPosts] = useState([]);

  const callAPI = async () => {
    try {
      const postsAPI = await PostAPI.getAllPosts();
      console.log(
        postsAPI.data.data
          .map((post) => ({
            ...post,  
            account: post.postUser,
          }))
          .slice(0, 6)
      );
      setPosts(
        postsAPI.data.data.map((post) => ({
          ...post,
          likeNum: post.likes ? post.likes.length : 0,
          commentNum: post.likes ? post.likes.length : 0,
          account: post.postUser,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        margin: 10,
        padding: 20,
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="container mt-3"
        style={{
          fontSize: 25,
          fontWeight: 600,
          marginLeft: 0,
        }}
      >
        Các thói quen tốt
      </div>
      <div className="row">
        {posts.map((post) => (
          <div className="col-md-6">
            <ItemComponent post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default General;
