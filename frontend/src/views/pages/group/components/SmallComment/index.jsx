import React, { useState } from "react";
import "./index.scss";
import { Button, Image } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import LikeAPI from "../../../../../../src/api/likeAPI";
const checkLike = (likes, userId) => {
  return likes.includes(userId);
};
function SmallComment(props) {
  const { comment, user } = props;

  const [likeNum, setLikeNum] = useState(comment.likes.length);

  const [isLike, setIsLike] = useState(checkLike(comment.likes, user.userId));
  const onLike = async () => {
    console.log(comment);
    try {
      LikeAPI.LikeComment(user.userId, comment.id);
      setIsLike(!isLike);
      setLikeNum(isLike ? likeNum - 1 : likeNum + 1);
    } catch (error) {
      console.log(error);
    }
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
        {comment.image && (
          <Image
            alt="comment img"
            src={comment.image}
            className="group-small-comment-image"
          />
        )}
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Button
              icon={!isLike ? <HeartOutlined /> : <HeartFilled />}
              onClick={onLike}
              className="group-small-post-button"
              style={{ color: "#EB3223" }}
            />
            <div>{likeNum}</div>
          </div>
          <p className=" group-small-comment-createdAt">
            {comment.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SmallComment;
