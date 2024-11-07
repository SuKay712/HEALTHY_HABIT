import { useContext, useEffect, useState } from "react";
import profileAPI from "../../../../../api/profileAPI";
import { AuthContext } from "../../../../../context/authContext";
import { toastError, toastSuccess } from "../../../../../utils/toast";

export default function PasswordForm() {
  const [isOpenPasswordForm, setIsOpenPasswordForm] = useState(false);

  const { user } = useContext(AuthContext);

  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const resetData = () => {
    setData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsOpenPasswordForm(false);
  };

  const handleUpdateProfile = async () => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toastError("Mật khẩu xác nhận không khớp với mật khẩu mới");
        return;
      }

      const dataToSend = {
        userId: user.userId,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };

      const response = await profileAPI.updatePassword(dataToSend);
      console.log(response);
      toastSuccess("Cập nhật thành công!");
      resetData();
    } catch (error) {
      toastError(error.message);
    }
  };

  const handleCancel = () => {
    resetData();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    setData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  return (
    <>
      <div className="row mt-3">
        <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column ">
          {isOpenPasswordForm ? (
            <button className="btn  w-100 submit-btn" disabled>
              Đổi mật khẩu
            </button>
          ) : (
            <button
              className="btn  w-100 submit-btn"
              onClick={() => {
                setIsOpenPasswordForm(true);
              }}
            >
              Đổi mật khẩu
            </button>
          )}
        </div>
      </div>

      {isOpenPasswordForm && (
        <div className="mt-3">
          <div className="row mb-3">
            <div className="col-md-12 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Mật khẩu cũ
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập thông tin"
                name="oldPassword"
                value={data.oldPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 d-flex justify-center-start password-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Nhập thông tin"
                name="newPassword"
                value={data.newPassword}
                onChange={handleInputChange}
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
                Xác nhận mật khẩu
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập thông tin"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row mb-3 mt-4">
            <div className="col-md-2 d-flex justify-center-start text-start gap-2 flex-column ">
              <button
                className="btn  w-100 cancel-btn"
                onClick={() => {
                  handleCancel();
                }}
              >
                Hủy
              </button>
            </div>

            <div className="col-md-2 d-flex justify-center-start text-start gap-2 flex-column ">
              <button
                className="btn  w-100 submit-btn"
                onClick={() => {
                  handleUpdateProfile();
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
