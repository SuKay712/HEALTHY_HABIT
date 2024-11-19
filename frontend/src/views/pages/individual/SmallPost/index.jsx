import React, { useEffect, useState } from "react";
import "./index.scss";
import { Button, Dropdown } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import {
  DeleteFilled,
  EditFilled,
  HeartFilled,
  HeartOutlined,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";
import { FaCircle, FaRegCommentDots } from "react-icons/fa";
import TextArea from "antd/es/input/TextArea";
import { ImGrin, ImSpinner } from "react-icons/im";
import { BsCursorFill } from "react-icons/bs";
import SmallComment from "../SmallComment";
import { BiDotsHorizontal } from "react-icons/bi";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRegImage } from "react-icons/fa";

function SmallPost(props) {
  const { post, user, onUpdatePost } = props;

  const [isLike, setIsLike] = useState(false);

  const [comment, setComment] = useState("");
  const [isShowComment, setIsShowComment] = useState(false);

  const [comments, setComments] = useState(post.comments);

  const [isPin, setIsPin] = useState(false);

  const handleNavigateEdit = () => {
    navigate("/editpost", { state: { post, user } }); // Đường dẫn đến trang bạn muốn chuyển hướng
  };
  const onLike = () => {
    onUpdatePost(post.id, {
      ...post,
      likeNum: isLike ? post.likeNum - 1 : post.likeNum + 1,
    });
    setIsLike(!isLike);
  };

  const onClickComment = () => {
    setIsShowComment(!isShowComment);
  };

  const onChangeComment = (e) => {
    setComment(e.target.value);
  };

  const onPin = () => {
    setIsPin(!isPin);
  };

  const navigate = useNavigate();

  const items = [
    {
      label: (
        <div className="d-flex align-items-center">
          <PushpinFilled />
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
          <EditFilled />
          <p
            style={{ margin: 0, padding: 0, marginLeft: "10px" }}
            onClick={handleNavigateEdit}
          >
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
    <div className="group-small-post-container">
      <div className="group-small-post-user-info-container">
        <div className="d-flex">
          <img
            className="group-small-post-avatar"
            alt="user avatar"
            src={user.avatar}
          />
          <div className="group-small-post-info-container">
            <div className="d-flex align-items-center">
              <p class="group-small-post-username">{user.displayName}</p>
              <p class="group-small-post-status">
                <FaCircle />
              </p>
            </div>
            <p className="group-small-post-createdAt">{post.createdAt}</p>
          </div>
        </div>
        <div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
            className="group-small-post-dropdown"
          >
            <BiDotsHorizontal onClick={(e) => e.preventDefault()} />
          </Dropdown>
        </div>
      </div>
      <div className="group-small-post-content-container">
        <p class="group-small-post-content">{post.content}</p>
        {post.image && (
          <img
            className="group-small-post-image"
            alt="post pic"
            src={post.image}
          />
        )}
        <div className="group-small-post-like-comment-container">
          <p>{post.likeNum}</p>
          <Button
            icon={
              !isLike ? (
                <HeartOutlined style={{ fontSize: "25px" }} />
              ) : (
                <HeartFilled style={{ fontSize: "25px" }} />
              )
            }
            onClick={onLike}
            className="group-small-post-button"
            style={{ color: "#EB3223" }}
          />
          <p>{post.commentNum}</p>
          <Button
            icon={<FaRegCommentDots />}
            onClick={onClickComment}
            className="group-small-post-button"
          />
          <Button
            icon={
              isPin ? (
                <PushpinFilled style={{ fontSize: "25px", color: "#ebc351" }} />
              ) : (
                <PushpinOutlined style={{ fontSize: "25px" }} />
              )
            }
            className="group-small-post-button"
            onClick={onPin}
          />
        </div>
        {isShowComment && (
          <div className="group-small-post-comment-container">
            <img
              alt="user avatar"
              src={user.avatar}
              className="group-small-post-avatar"
            />
            <TextArea
              placeholder={`Bình luận với vai trò ${user.displayName}`}
              className="group-small-post-input"
              autoSize
              value={comment}
              onChange={(value) => onChangeComment(value)}
            />
            <div className="group-small-post-button-container">
              <Button
                icon={<FaRegImage />}
                className="group-small-post-button"
              />
              <Button icon={<ImGrin />} className="group-small-post-button" />
              <Button
                icon={<BsCursorFill />}
                className="group-small-post-button"
              />
            </div>
          </div>
        )}
      </div>
      {isShowComment && (
        <div className="group-small-post-comment-wrapper">
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
