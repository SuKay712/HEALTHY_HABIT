import React, { useContext, useEffect, useRef, useState } from "react";
import "./index.scss";
import { AuthContext } from "../../../context/authContext";
import { Button } from "antd";
import { CameraFilled } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { ImGrin } from "react-icons/im";
import SmallPost from "./SmallPost";
import { FaRegImage } from "react-icons/fa";
import PostAPI from "../../../api/postAPI";
import AccountAPI from "../../../api/accountAPI";
import Modal from "../../../components/modal";
import AddPostForm from "./AddPostForm";

function Individual() {
  const { user, setUser } = useContext(AuthContext);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Refs for file inputs
  const avatarInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const callAPI = async () => {
    try {
      const response = await PostAPI.getAllPostByUserId(user.userId);


      const newPosts = response.data.data.map((post) => ({
        ...post,
        id: post.id,
        content: post.content,
        image: post.image,
        likeNum: post.likes?.length || 0,
        commentNum: post.comments?.length || 0,
        comments: post.comments
          ? post.comments.map((comment) => ({
              ...comment,
              account: comment.user,
            }))
          : [],
      }));

      setPosts(newPosts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  // Handler to open file picker for avatar
  const onChangeAvatar = () => {
    avatarInputRef.current.click();
  };

  // Handler to open file picker for background
  const onChangeBackground = () => {
    backgroundInputRef.current.click();
  };

  // Handler to handle avatar file change
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", user.userId);
      AccountAPI.updateAvatar(formData)
        .then((res) => {
          setUser({ ...user, avatar: res.data.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // Handler to handle background file change
  const handleBackgroundChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("bgImage", file);
      formData.append("userId", user.userId);
      AccountAPI.updateBackground(formData)
        .then((res) => {
          setUser({ ...user, backgroundImage: res.data.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onChangeNewPost = (value) => {
    setNewPost(value.target.value);
  };

  const handleAddLocalPost = (post) => {
    setPosts((posts) => [
      {
        ...post,
        id: post.id,
        content: post.content,
        image: post.image,
        likeNum: post.likes?.length || 0,
        commentNum: post.comments?.length || 0,
        comments: post.comments
          ? post.comments.map((comment) => ({
              id: comment.id,
              content: comment.content,
              account: comment.user,
            }))
          : [],
      },
      ...posts,
    ]);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };
  const handleShowAddForm = () => {
    setShowAddForm(true);
  };

  const onUpdatePost = (id, newPost) => {
    setPosts(
      posts.map((post) => {
        if (post.id !== id) return post;
        return newPost;
      })
    );
  };

  return (
    <div className="individual-container">
      {showAddForm && (
        <Modal onClickOutside={handleCloseAddForm}>
          <AddPostForm
            handleAddLocalPost={handleAddLocalPost}
            handleCloseForm={handleCloseAddForm}
          />
        </Modal>
      )}
      <div className="individual-info-container">
        <div className="individual-background-container">
          <img
            src={user.backgroundImage}
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
          {/* Hidden file input for background */}
          <input
            type="file"
            accept="image/*"
            ref={backgroundInputRef}
            style={{ display: "none" }}
            multiple={false}
            onChange={handleBackgroundChange}
          />
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
              <CameraFilled style={{ fontSize: "25px" }} />
            </Button>
            {/* Hidden file input for avatar */}
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              style={{ display: "none" }}
              multiple={false}
              onChange={handleAvatarChange}
            />
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
            onChange={onChangeNewPost}
            onClick={handleShowAddForm}
          />
          <div className="individual-new-post-button-container">
            <Button
              icon={<FaRegImage />}
              className="individual-new-post-button"
            />
            <Button icon={<ImGrin />} className="individual-new-post-button" />
          </div>
        </div>
      </div>
      <div className="individual-posts-container">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => (
            <SmallPost post={post} onUpdatePost={onUpdatePost} user={user} />
          ))}
      </div>
    </div>
  );
}

export default Individual;
