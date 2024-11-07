import { useContext, useEffect, useState } from "react";
import Avatar from "./components/avatar";
import BackgroundImage from "./components/background-image";
import "./index.scss";
import { AuthContext } from "../../../context/authContext";
import profileAPI from "../../../api/profileAPI";
import InfoForm from "./components/infoForm";

export default function UpdateProfile() {
  const { user } = useContext(AuthContext);

  const [formInfoData, setFormInfoData] = useState({
    username: "",
    displayName: "",
    address: "",
    email: "",
    tel: "",
    avatar: "",
    backgroundImage: "",
  });

  const fetchData = async () => {
    try {
      const response = await profileAPI.getProfile(user.userId);
      const data = {
        username: response.data.username,
        displayName: response.data.displayName,
        address: response.data.address,
        email: response.data.email,
        tel: response.data.tel,
        avatar: response.data.avatar,
        backgroundImage: response.data.backgroundImage,
      };
      setFormInfoData(data);
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className="profile-section"
      style={{
        padding: 10,
        margin: 10,
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <BackgroundImage
        formInfoData={formInfoData}
        setFormInfoData={setFormInfoData}
      />
      <Avatar formInfoData={formInfoData} setFormInfoData={setFormInfoData} />

      <div className="display-name-section ">
        <span className="display-name-content form-control">
          {formInfoData.displayName}
        </span>
      </div>

      <InfoForm formInfoData={formInfoData} setFormInfoData={setFormInfoData} />
    </div>
  );
}
