import React, { useState } from "react";
import "./index.scss";
import { Button, Image } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../context/authContext";
import LikeAPI from "../../../../api/likeAPI";
import "bootstrap/dist/css/bootstrap.min.css";

function SmallComment(props) {
  const { comment } = props;

  const { user } = useAuth();

  const [isLike, setIsLike] = useState(comment.hasLikedComment);

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
    <div className="individual-small-comment-container">
      <img
        alt="user avatar"
        src={comment.account.avatar}
        className="individual-small-comment-avatar"
      />
      <div className="individual-small-comment-info-container">
        <p className="individual-small-comment-username">
          {comment.account.name}
        </p>
        <p>{comment.content}</p>
        {
          comment.image && <Image alt='comment img' src={comment.image} className="individual-small-comment-image"/>
        }
        <div className="d-flex align-items-center justify-content-between">
          <Button
            icon={!isLike ? <HeartOutlined /> : <HeartFilled />}
            onClick={onLike}
            className="individual-small-post-button"
            style={{ color: "#EB3223" }}
          />
          <p className=" individual-small-comment-createdAt">{comment.createdAt}</p>
        </div>
      </div>
    </div>
  );
}

export default SmallComment;
