import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ItemComponent.scss";
import { CommentOutlined, HeartFilled } from "@ant-design/icons";
function ItemComponent({ post }) {

  return (
    <div className="row mb-1 general-item-container">
      <div className="d-flex align-items-center m-0 p-0">
        {post.image && (
          <img src={post.image} alt="Hình ảnh" className="general-item-image" />
        )}
        <div className="w-100">
          <p>{post.content}</p>
          <div className="d-flex justify-content-between">
            <div className="general-item-account-container">
              <img alt="avatar user" src={post.account.avatar} />
              <p>{post.account.displayName}</p>
            </div>
            <div className="general-item-post-info-container">
              <HeartFilled className="general-item-heart-icon"/>
              <p>{post.likes ? post.likes.length : 0}</p>
              <CommentOutlined  className="general-item-comment-icon"/>
              <p>{post.comments ? post.comments.length : 0}</p>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-3" />
    </div>
  );
}

export default ItemComponent;
