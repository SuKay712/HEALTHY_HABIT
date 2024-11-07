import { Button } from "antd";
import "./index.scss";
import { CameraFilled } from "@ant-design/icons";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../../../context/authContext";
import { toastSuccess, toastError } from "../../../../../utils/toast";
import profileAPI from "../../../../../api/profileAPI";

export default function Avatar({ formInfoData, setFormInfoData }) {
  const avatarInputRef = useRef(null);
  const { user } = useContext(AuthContext);

  const onChangeAvatar = () => {
    avatarInputRef.current.click();
  };

  const handleAvatarChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toastError("Vui lòng chọn một tệp hình ảnh.");
          return;
        }
        const formData = new FormData();
        formData.append("image", file);
        formData.append("userId", user.userId);
        const response = await profileAPI.updateAvatar(formData);
        setFormInfoData({ ...formInfoData, avatar: response.data });
        toastSuccess("Cập nhật avatar thành công!");
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <div className="avatar">
      <div className="avatar-content">
        <img
          src={formInfoData.avatar} // Thay thế bằng URL ảnh của bạn
          alt="Avatar"
          className="avatar-image"
        />
        <Button onClick={onChangeAvatar} className="avatar-button">
          <CameraFilled style={{ fontSize: "25px" }} />
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={avatarInputRef}
          style={{ display: "none" }}
          multiple={false}
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  );
}
