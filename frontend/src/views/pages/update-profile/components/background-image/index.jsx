import { Button } from "antd";
import "./index.scss";
import { CameraFilled } from "@ant-design/icons";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../../../context/authContext";
import { toastSuccess, toastError } from "../../../../../utils/toast";
import profileAPI from "../../../../../api/profileAPI";

export default function BackgroundImage({ formInfoData, setFormInfoData }) {
  const backgroundInputRef = useRef(null);
  const { user, setUser } = useContext(AuthContext);

  const onChangeBgImage = () => {
    backgroundInputRef.current.click();
  };

  const handleBgImageChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toastError("Vui lòng chọn một tệp hình ảnh.");
          return;
        }
        const formData = new FormData();
        formData.append("bgImage", file);
        formData.append("userId", user.userId);
        const response = await profileAPI.updateBackgroundImage(formData);
        setFormInfoData({ ...formInfoData, backgroundImage: response.data });
        setUser({ ...user, backgroundImage: response.data });
        toastSuccess("Cập nhật ảnh bìa thành công!");
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <div style={{ width: "100%", position: "relative" }} className="bg-image">
      <div style={{ paddingBottom: "19.44%", position: "relative" }}>
        <img
          src={formInfoData.backgroundImage}
          alt="Mô tả ảnh"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 99,
          }}
        />
        <Button onClick={onChangeBgImage} className="bg-button">
          <CameraFilled style={{ fontSize: "25px" }} />
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={backgroundInputRef}
          style={{ display: "none" }}
          multiple={false}
          onChange={handleBgImageChange}
        />
      </div>
    </div>
  );
}
