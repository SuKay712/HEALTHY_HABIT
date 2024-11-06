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

      {/* <div className="personal-info-section">
        <h4>Thông tin cá nhân</h4>
        <div>
          <div className="row mb-3">
            <div className="col-md-12 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập thông tin"
                name="name"
                disabled
                value={formInfoData.username}
                // onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Tên hiển thị
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập thông tin"
                name="name"
                disabled
                value={formInfoData.displayName}
                // onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="contact-info-section">
        <h4>Liên lạc và địa chỉ</h4>
        <div>
          <div className="row mb-3">
            <div className="col-md-6 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Email
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập thông tin"
                name="name"
                value={formInfoData.email}
                // onChange={handleInputChange}
                // min={getCurrentDate()}
                disabled
              />
            </div>

            <div className="col-md-6 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Số điện thoại
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập thông tin"
                name="name"
                value={formInfoData.tel}
                // onChange={handleInputChange}
                disabled
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Quê quán
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập thông tin"
                name="name"
                disabled
                value={formInfoData.address}
                // onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="action-section">
        <div className="row mt-3">
          <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column ">
            <button className="btn  w-100 submit-btn" disabled>
              Chỉnh sửa thông tin
            </button>
          </div>

          <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column ">
            <button className="btn  w-100 cancel-btn">Hủy</button>
          </div>

          <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column ">
            <button className="btn  w-100 submit-btn">Cập nhật</button>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column ">
            <button className="btn  w-100 submit-btn">Đổi mật khẩu</button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
