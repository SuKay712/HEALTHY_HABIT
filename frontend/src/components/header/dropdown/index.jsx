import React from "react";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
function TruncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }
  return <span>{`${text.slice(0, maxLength)}...`}</span>;
}

function getItemDropDownSearchPost(filterPosts) {
  return filterPosts
    .map((post) => ({
      key: post.id,
      label: (
        <div class="header-search-item-container">
          {post.image && (
            <img
              alt={`post ${post.id} img`}
              src={post.image}
              class="header-search-item-image"
            />
          )}
          <div className="header-search-content-container">
            <p class="header-search-item-content">
              {TruncateText(post.content, 100)}
            </p>
            <div className="d-flex align-items-center">
              <img
                alt={`avatar user`}
                src={post.account.avatar}
                class="header-search-account-avatar"
              />
              <p class="header-search-account-username">{post.account.name}</p>
            </div>
          </div>
        </div>
      ),
    }))
    .slice(0, 15);
}

export default getItemDropDownSearchPost;
