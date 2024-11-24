import "./index.scss";
import { FaTimes, FaImage, FaGrin, FaMapMarkerAlt } from "react-icons/fa";
import { Button, message } from "antd";
import { useRef, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import axiosClient from "../../../../../api/axiosClient";
import { useAuth } from "../../../../../context/authContext";

const AddPostForm = ({ handleCloseForm, handleAddLocalPost, callAPI }) => {
  const { user } = useAuth();
  const imageInputRef = useRef();
  const [image, setImage] = useState();
  const [imageFile, setImageFile] = useState();
  const [content, setContent] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const disabled = !content;

  const handleChangeContent = (e) => {
    setContent(e.currentTarget.value);
  };

  const handleImageInputClick = () => {
    if (imageInputRef) imageInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImageFile(file);
    }
  };

  const hanleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      if (image) {
        formData.append("image", imageFile);
      }
      formData.append("content", content);
      formData.append("userId", user.userId);
      formData.append("isPrivate", "false");

      const response = await axiosClient.formData.post(
        "/api/user/post",
        formData
      );

      handleAddLocalPost(response.data.data);
      callAPI();

      handleCloseForm();
    } catch (err) {
      messageApi.error(
        "Remember to bring snacks when traveling to distant worlds. 🍕🪐"
      );
    }

    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <form className="ap-form">
        <header className="ap-form-header">
          <p className="ap-form-title">Tạo bài viết</p>
          <button
            className="ap-form-close"
            type="button"
            onClick={handleCloseForm}
            disabled={loading}
          >
            <FaTimes />
          </button>
        </header>
        <main className="ap-form-main">
          <div className="ap-form-main-user">
            <img
              src={user.avatar}
              alt=""
              className="ap-form-main-user-avatar"
            />
            <p className="ap-form-main-user-name">{user.displayName}</p>
          </div>
          <div className="ap-form-main-text">
            <textarea
              className="ap-form-main-text-input"
              placeholder={`${user.displayName} ơi bạn đang nghĩ gì thế?`}
              value={content}
              onChange={handleChangeContent}
              disabled={loading}
            ></textarea>
            <span className="ap-form-main-text-icon">
              <FaGrin />
            </span>
          </div>
          {image && (
            <div className="ap-form-main-image">
              <img src={image} alt="I feel so bad" />
              <div className="overlay">
                <Button
                  className="remove-image-button"
                  shape="circle"
                  type="text"
                  color="danger"
                  icon={<CloseOutlined />}
                  onClick={hanleRemoveImage}
                  disabled={loading}
                />
              </div>
            </div>
          )}
          <button
            className="ap-form-main-add-image-button"
            type="button"
            onClick={handleImageInputClick}
            disabled={loading}
          >
            <p className="ap-form-main-add-image-button-text">
              Thêm vào bài viết của bạn
            </p>
            <p className="ap-form-main-add-image-button-icons">
              <FaImage className="ap-form-main-add-image-button-icons-image" />
              <FaMapMarkerAlt className="ap-form-main-add-image-button-icons-map" />
            </p>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            hidden
            onChange={handleImageChange}
          />
          <Button
            type="primary"
            className="ap-form-main-submit"
            onClick={handleSubmit}
            disabled={disabled || loading}
          >
            Đăng
          </Button>
        </main>
      </form>
    </>
  );
};

export default AddPostForm;
