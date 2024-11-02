import React, { useContext, useState } from "react";
import "./index.scss";
import { AuthContext } from "../../../context/authContext";
import { Button } from "antd";
import { CameraFilled, PictureOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { ImGrin } from "react-icons/im";
import fakeData from "../../../data/fakeData.json";
import SmallPost from "./SmallPost";

function Individual() {
  var { user } = useContext(AuthContext);
  const [newPost, setNewPost] = useState("");

  const { individual } = fakeData;
  const [posts, setPosts] = useState(individual.posts);

  user = {
    ...user,
    background: user.background
      ? user.background
      : "https://res.cloudinary.com/deei5izfg/image/upload/v1730480903/%E1%BA%A3nh_b%C3%ACa_2_cmiiiq.png",
    avatar:
      (!user.avatar || user.avatar === "avatar3.png") &&
      "https://i.pinimg.com/564x/cb/d4/45/cbd44516a552e11d908abf735786e497.jpg",
  };

  const onChangeBackground = () => {};

  const onChangeAvatar = () => {};

  const onChangeNewPost = (value) => {
    setNewPost(value.target.value);
  };

  return (
    <div className="individual-container">
      <div className="individual-info-container">
        <div className="individual-background-container">
          <img
            src={user.background}
            alt="user background"
            className="individual-info-background"
          />
          <Button
            onClick={onChangeBackground}
            className="individual-info-background-button"
          >
            <p>Chỉnh sửa ảnh bìa</p>
            <CameraFilled />
          </Button>
        </div>
        <div className="individual-info-persional-container">
          <div className="position-relative">
            <img
              src={user.avatar}
              alt="user avatar"
              className="individual-info-avatar"
            />
            <Button
              onClick={onChangeAvatar}
              className="individual-info-avatar-button"
            >
              <CameraFilled />
            </Button>
          </div>
          <p className="individual-username">{user.username}</p>
        </div>
        
      </div>
      <div className="individual-new-post-container">
        <img
          alt="user avatar"
          src={user.avatar}
          className="individual-new-post-avatar"
        />
        <div className="individual-new-post-input-container">
          <TextArea
            placeholder="Bạn đang nghĩ gì ?"
            className="individual-new-post-input"
            autoSize
            value={newPost}
            onChange={(value) => onChangeNewPost(value)}
          />
          <div className="individual-new-post-button-container">
            <Button
              icon={<PictureOutlined />}
              className="individual-new-post-button"
            />
            <Button icon={<ImGrin />} className="individual-new-post-button" />
          </div>
        </div>
      </div>
      <div className="individual-posts-container">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => <SmallPost post={post} user={user} />)}
      </div>
    </div>
  );
}

export default Individual;
