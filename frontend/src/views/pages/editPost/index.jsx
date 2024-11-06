import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.scss";
import { FaImage,FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
const EditPostBootstrap = () => {
  const location = useLocation();
  const { post, user } = location.state || {};
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [updatedPost, setUpdatedPost] = useState({ ...post });
  const handleContentChange = (e) => {
    setUpdatedPost(prevState => ({ ...prevState, content: e.target.value }));
  };
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const formData = new FormData();
  const postId = post.id;
  const content = updatedPost.content;
  formData.append('postId', postId);
  const handleClose = () => {
    navigate('/individual');

  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedPost(prevState => ({ ...prevState, image: reader.result }));
      }

      reader.readAsDataURL(file);
    } else { setImageFile(null); }
  };
  const handleDeleteImage = () => {

    setUpdatedPost(prevState => ({ ...prevState, image: '' }));
    formData.set('isDeleteImage', true);
  };
  const handleSave = async () => {
    formData.append('content', updatedPost.content);
    formData.append('isDeleteImage', !updatedPost.image); 
    if (imageFile) {
      formData.append('image', imageFile);
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.put('https://healthy-habit.onrender.com/api/user/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      console.log('Response:', response.data);
      navigate('/individual');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: 10, paddingBottom: 10 }}>
      <div className="modal-dialog modal-custom" >
        <div className="modal-content" style={{
        backgroundColor: '#cdf5ff'
      }}>
          <div className="modal-header" style={{ borderBottom: '2px solid white' }}>
            <h5 className="modal-title">Chỉnh sửa bài viết</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">

            <div className="d-flex align-items-center mb-3">
              <img src={user.avatar} alt="User avatar" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
              <span className="fw-bold" style={{
                marginBottom: 15
              }}>{user.username}</span>
            </div>
            <textarea
              className="form-control mb-3"
              rows="1"
              placeholder="Bạn đang nghĩ gì?"
              value={updatedPost.content}
              onChange={handleContentChange}
              style={{
                backgroundColor: '#cdf5ff',
                border: 'none',
                outline: 'none' 
              }}
            />

            <div className="position-relative mb-3">
              <img src={updatedPost.image} alt="" className="img-fluid rounded" style={{ maxWidth: '100%', height: 'auto' }} />
              {updatedPost.image && <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={handleDeleteImage}
              >
                &times;
              </button>}
            </div>

            <div className="mb-3" style={{
              border: '1px solid black',
              borderRadius: '4px',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <label className="form-label" style={{
                marginBottom: 0
              }}>Thêm ảnh</label>
               <div className="d-flex align-items-center">
              <label htmlFor="imageUpload" className="btn btn-outline-secondary ms-1" style={{
                border: 'none'
              }}>
                <FaImage color='green' style={{ fontSize: '1.5em' }} />
                
              </label>
              <FaMapMarkerAlt color="blue" className="ms-1"style={{
                marginRight:10,
                fontSize: '1.5em' 
              }}/> 
              </div>
              <input
                className="d-none"
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose} >Hủy</button>
            <button type="button" className="btn btn-primary" onClick={handleSave} >Lưu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostBootstrap;
