import React, { useState } from "react";
import "./index.scss";
import { Button } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

function SmallComment(props) {
  const { comment, user } = props;

  const [isLike, setIsLike] = useState(false);

  const onLike = () => {
    setIsLike(!isLike);
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
        <div>
          <Button
            icon={!isLike ? <HeartOutlined /> : <HeartFilled />}
            onClick={onLike}
            className="individual-small-post-button"
            style={{ color: "#EB3223" }}
          />
        </div>
      </div>
    </div>
  );
}

export default SmallComment;
