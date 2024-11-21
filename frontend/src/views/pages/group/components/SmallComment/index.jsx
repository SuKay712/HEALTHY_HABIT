import React, { useState } from "react";
import "./index.scss";
import { Button,Image } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import LikeAPI from "../../../../../../src/api/likeAPI";
function SmallComment(props) {
  const { comment, user } = props;

  const [isLike, setIsLike] = useState(false);

  
  const onLike = async () => {
    console.log(comment)
    LikeAPI.LikeComment(user.userId, comment.id)
      .then(() => {
        setIsLike(!isLike);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="group-small-comment-container">
      <img
        alt="user avatar"
        src={comment.account.avatar}
        className="group-small-comment-avatar"
      />
      <div className="group-small-comment-info-container">
        <p className="group-small-comment-username">
          {comment.account.displayName}
        </p>
        <p>{comment.content}</p>
        {
          comment.image && <Image alt='comment img' src={comment.image} className="group-small-comment-image"/>
        }
        <div>
          <Button
            icon={!isLike ? <HeartOutlined /> : <HeartFilled />}
            onClick={onLike}
            className="group-small-post-button"
            style={{ color: "#EB3223" }}
          />
        </div>
      </div>
    </div>
  );
}

export default SmallComment;
