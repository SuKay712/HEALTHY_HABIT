import React, { useState } from "react";
import "./index.scss";
import { Button, Dropdown } from "antd";
import {
  DeleteFilled,
  EditFilled,
  HeartFilled,
  HeartOutlined,
  PictureOutlined,
  PushpinFilled,
} from "@ant-design/icons";
import { FaRegCommentDots } from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import { ImGrin } from "react-icons/im";
import { BsCursorFill } from "react-icons/bs";
import SmallComment from "../SmallComment";
import { BiDotsHorizontal } from "react-icons/bi";
import "bootstrap/dist/css/bootstrap.min.css";

function SmallPost(props) {
  const { post, user } = props;

  const [isLike, setIsLike] = useState(false);

  const [comment, setComment] = useState("");
  const [isShowComment, setIsShowComment] = useState(false);

  const [comments, setComments] = useState(post.comments);

  const onLike = () => {
    setIsLike(!isLike);
  };

  const onClickComment = () => {
    setIsShowComment(!isShowComment);
  };

  const onChangeComment = (e) => {
    setComment(e.target.value);
  };

  const items = [
    {
      label: (
        <div className="d-flex align-items-center">
          <PushpinFilled />{" "}
          <p style={{ margin: 0, padding: 0, marginLeft: "10px" }}>
            Ghim bài viết
          </p>
        </div>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div className="d-flex align-items-center">
          <EditFilled />{" "}
          <p style={{ margin: 0, padding: 0, marginLeft: "10px" }}>
            Chỉnh sửa bài viết
          </p>
        </div>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: (
        <div className="d-flex align-items-center">
          <DeleteFilled />
          <p style={{ margin: 0, padding: 0, marginLeft: "10px" }}>
            Chuyển vào thùng rác
          </p>
        </div>
      ),
      key: "3",
    },
  ];

  return (
    <div className="individual-small-post-container">
      <div className="individual-small-post-user-info-container">
        <div className="d-flex">
          <img
            className="individual-small-post-avatar"
            alt="user avatar"
            src={user.avatar}
          />
          <div className="individual-small-post-info-container">
            <p class="individual-small-post-username">{user.username}</p>
            <p class="individual-small-post-status">online</p>
          </div>
        </div>
        <div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <BiDotsHorizontal onClick={(e) => e.preventDefault()} />
          </Dropdown>
        </div>
      </div>
      <div className="individual-small-post-content-container">
        <p class="individual-small-post-content">{post.content}</p>
        <img
          className="individual-small-post-image"
          alt="post pic"
          src={post.image}
        />
        <div className="individual-small-post-like-comment-container">
          <p>{post.likeNum}</p>
          <Button
            icon={!isLike ? <HeartOutlined /> : <HeartFilled />}
            onClick={onLike}
            className="individual-small-post-button"
            style={{ color: "#EB3223" }}
          />
          <p>{post.commentNum}</p>
          <Button
            icon={<FaRegCommentDots />}
            onClick={onClickComment}
            className="individual-small-post-button"
          />
        </div>
        {isShowComment && (
          <div className="individual-small-post-comment-container">
            <img
              alt="user avatar"
              src={user.avatar}
              className="individual-small-post-avatar"
            />
            <TextArea
              placeholder={`Bình luận với vai trò ${user.username}`}
              className="individual-small-post-input"
              autoSize
              value={comment}
              onChange={(value) => onChangeComment(value)}
            />
            <div className="individual-small-post-button-container">
              <Button
                icon={<PictureOutlined />}
                className="individual-small-post-button"
              />
              <Button
                icon={<ImGrin />}
                className="individual-small-post-button"
              />
              <Button
                icon={<BsCursorFill />}
                className="individual-small-post-button"
              />
            </div>
          </div>
        )}
      </div>
      {isShowComment && (
        <div className="individual-small-post-comment-wrapper">
          {comments &&
            comments.length > 0 &&
            comments.map((comment) => (
              <SmallComment comment={comment} user={user} />
            ))}
        </div>
      )}
    </div>
  );
}

export default SmallPost;
