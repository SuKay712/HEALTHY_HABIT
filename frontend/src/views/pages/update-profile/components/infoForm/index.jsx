import { useContext, useEffect, useState } from "react";
import profileAPI from "../../../../../api/profileAPI";
import { AuthContext } from "../../../../../context/authContext";
import { toastError, toastSuccess } from "../../../../../utils/toast";
import PasswordForm from "../passwordForm";

export default function InfoForm({ formInfoData, setFormInfoData }) {
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useContext(AuthContext);

  const [data, setData] = useState({
    username: "",
    displayName: "",
    email: "",
    tel: "",
    address: "",
  });

  const renderData = () => {
    setData({
      username: formInfoData.username,
      displayName: formInfoData.displayName,
      email: formInfoData.email,
      tel: formInfoData.tel,
      address: formInfoData.address,
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const dataToSend = {
        userId: user.userId,
        displayName: data.displayName,
        email: data.email,
        tel: data.tel,
        address: data.address,
      };
      const response = await profileAPI.updateProfileInfo(dataToSend);
      console.log(response);
      setFormInfoData({
        ...formInfoData,
        displayName: response.data.displayName,
        email: response.data.email,
        tel: response.data.tel,
        address: response.data.address,
      });
      toastSuccess("Cập nhật thành công!");
      setIsEdit(false);
    } catch (error) {
      toastError(error.message);
    }
  };

  const handleCancel = () => {
    renderData();
    setIsEdit(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    setData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  useEffect(() => {
    console.log(formInfoData);
    if (formInfoData) renderData();
  }, [formInfoData]);

  return (
    <>
      <div className="personal-info-section">
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
                name="username"
                disabled
                value={data.username}
                onChange={handleInputChange}
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
                name="displayName"
                disabled={!isEdit}
                value={data.displayName}
                onChange={handleInputChange}
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
                name="email"
                value={data.email}
                onChange={handleInputChange}
                disabled={!isEdit}
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
                name="tel"
                value={data.tel}
                onChange={handleInputChange}
                disabled={!isEdit}
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
                name="address"
                disabled={!isEdit}
                value={data.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="action-section">
        <div className="row mt-3">
          <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column ">
            {isEdit ? (
              <button
                className="btn  w-100 submit-btn"
                disabled
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Chỉnh sửa thông tin
              </button>
            ) : (
              <button
                className="btn  w-100 submit-btn"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Chỉnh sửa thông tin
              </button>
            )}
          </div>
          {isEdit && (
            <>
              <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column ">
                <button
                  className="btn  w-100 cancel-btn"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  Hủy
                </button>
              </div>

              <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column ">
                <button
                  className="btn  w-100 submit-btn"
                  onClick={() => {
                    handleUpdateProfile();
                  }}
                >
                  Cập nhật
                </button>
              </div>
            </>
          )}
        </div>

        <PasswordForm />
      </div>
    </>
  );
}
