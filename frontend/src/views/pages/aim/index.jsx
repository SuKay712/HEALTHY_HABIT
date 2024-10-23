import React, { useState, useRef, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import { postTask } from "../../../api/aimAPI";
import { AuthContext } from "../../../context/authContext";
import AimInCompleted from "./components/AimInCompleted";
import AimEnded from "./components/AimEnded";
import { toastError, toastSuccess } from "../../../utils/toast";

const Aim = () => {
  const options = [
    { value: "ALL", label: "Lặp lại hàng ngày" },
    { value: "MONDAY", label: "Lặp lại mỗi thứ 2" },
    { value: "TUESDAY", label: "Lặp lại mỗi thứ 3" },
    { value: "WEDNESDAY", label: "Lặp lại mỗi thứ 4" },
    { value: "THURSDAY", label: "Lặp lại mỗi thứ 5" },
    { value: "FRIDAY", label: "Lặp lại mỗi thứ 6" },
    { value: "SATURDAY", label: "Lặp lại mỗi thứ 7" },
    { value: "SUNDAY", label: "Lặp lại mỗi chủ nhật" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prize: "",
    dateStart: "",
    dateEnd: "",
    timer: [], // Lưu giá trị từ select multiple
    timeExpired: "",
  });

  const [newAim, setNewAim] = useState(null);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedFormData = { ...prevData, [name]: value };

      if (
        name === "dateStart" &&
        new Date(value) > new Date(prevData.dateEnd)
      ) {
        updatedFormData.dateEnd = "";
        updatedFormData.timeExpired = "";
      }

      if (formData.dateStart) {
        if (
          name === "dateEnd" &&
          new Date(value) < new Date(prevData.dateStart)
        ) {
          alert("Ngày kết thúc phải sau ngày bắt đầu!");
          updatedFormData.dateEnd = "";
        }
      }

      if (name === "dateEnd" && value === getCurrentDate()) {
        updatedFormData.timeExpired = "";
      }

      if (name === "timeExpired") {
        const currentTime = getCurrentTime();
        const currentDate = getCurrentDate();
        if (!formData.dateEnd) {
          toastError("Vui lòng chọn ngày kết thúc!");
          return prevData;
        }

        if (formData.dateEnd === currentDate) {
          if (value && value <= currentTime) {
            toastError("Giờ hết hạn phải sau giờ hiện tại!");
            return prevData;
          }
        }
      }

      return updatedFormData;
    });
  };

  //Tạo ref và state để xử lý truncate cho select
  const ref = useRef(null);
  const [enable, setEnable] = useState(true);

  // Tạo state để theo dõi các tùy chọn đã chọn và trạng thái hiển thị
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleSelectChange = (value) => {
    let newSelectedOptions = [];

    if (selectedOptions.includes(value)) {
      if (value !== "ALL") {
        if (selectedOptions.includes(value)) {
          newSelectedOptions = selectedOptions.filter(
            (option) => option !== value
          );
        }

        if (newSelectedOptions.length === 0) setSelectedOptions([]);
        else setSelectedOptions(newSelectedOptions);
      } else {
        setSelectedOptions([]);
      }
    } else {
      if (value === "ALL") {
        setSelectedOptions(["ALL"]);
      } else {
        const newSelectedOptions = selectedOptions.filter(
          (option) => option !== "ALL"
        );
        if (newSelectedOptions.length === 6) setSelectedOptions(["ALL"]);
        else setSelectedOptions([...newSelectedOptions, value]);
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      timer: newSelectedOptions,
    }));
  };

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false); // Ẩn bảng chọn nếu nhấp ra ngoài
    }
  };

  const optionsRef = useRef(null);

  const formatDate = (date) => {
    const d = new Date(date);
    let day = "" + d.getDate();
    let month = "" + (d.getMonth() + 1);
    const year = d.getFullYear();

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [day, month, year].join("-");
  };

  const { user } = useContext(AuthContext);

  const handleSubmit = async () => {
    const userId = user.userId; // Giá trị userId của bạn

    let dataToSend; // Khai báo biến tạm

    // Kiểm tra điều kiện
    if (formData.dateEnd === "" || formData.timer.length === 0) {
      // Nếu điều kiện thỏa mãn, gán giá trị vào dataToSend
      dataToSend = {
        userId: userId,
        name: formData.name,
        description: formData.description,
        prize: formData.prize,
        dateStart: formatDate(formData.dateStart),
        timeExpired: formData.timeExpired,
      };
    } else {
      // Nếu không thỏa mãn, gán giá trị từ formData
      dataToSend = {
        userId: userId,
        ...formData,
        dateStart: formatDate(formData.dateStart), // Định dạng lại ngày bắt đầu
        dateEnd: formatDate(formData.dateEnd), // Định dạng lại ngày kết thúc
      };
    }
    console.log(dataToSend);
    try {
      // Gọi API thông qua aimAPI
      const result = await postTask(dataToSend);
      if (result) {
        toastSuccess("Thêm mục tiêu thành công!");
        console.log("API response:", result);
        // Reset form sau khi gửi thành công
        setFormData({
          name: "",
          description: "",
          prize: "",
          dateStart: "",
          dateEnd: "",
          timer: [],
          timeExpired: "",
        });
        setNewAim(result);
        setSelectedOptions([]);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
      toastError("Có lỗi gì đó");
    }
  };

  useEffect(() => {
    if (ref.current) {
      setEnable(ref.current.clientWidth < ref.current.scrollWidth);
    }

    document.addEventListener("mousedown", handleClickOutside); // Lắng nghe sự kiện nhấp chuột
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Dọn dẹp sự kiện
    };
  }, [selectedOptions]);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        margin: 10,
        padding: 20,
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ marginLeft: 20, color: "#00CDFF" }}>Tạo mục tiêu</h2>
      <div className="p-3 m-3">
        {/* Hàng 1 */}
        <div className="mb-3">
          <div className="row">
            <div className="col-md-3">
              <label>Mục tiêu</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập thông tin"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-3">
              <label> Ngày bắt đầu</label>
              <input
                type="date"
                className="form-control"
                name="dateStart"
                value={formData.dateStart}
                onChange={handleInputChange}
                min={getCurrentDate()}
              />
            </div>
            <div className="col-md-3">
              <label> Ngày kết thúc</label>
              <input
                type="date"
                className="form-control"
                name="dateEnd"
                value={formData.dateEnd}
                onChange={handleInputChange}
                min={formData.dateStart || getCurrentDate()}
                disable={formData.dateStart ? false : true}
              />
            </div>
            <div className="col-md-3">
              <label>Vòng lặp</label>
              <div className="position-relative truncate-select">
                <div
                  ref={ref}
                  className="form-control  text-truncate "
                  style={{ height: "auto", cursor: "pointer" }}
                  onClick={handleToggleOptions}
                >
                  {selectedOptions.length > 0
                    ? selectedOptions.join(", ")
                    : "chọn vòng lặp"}
                </div>
                {enable && (
                  <span className="truncate-tooltip position-absolute left-0">
                    {selectedOptions.length > 0
                      ? selectedOptions.join(", ")
                      : ""}
                  </span>
                )}
              </div>
              <div className="position-relative">
                {showOptions && (
                  <div
                    ref={optionsRef}
                    style={{
                      border: "1px solid #00CDFF",
                      borderRadius: "4px",
                      marginTop: "5px",
                      maxHeight: "150px",
                      overflowY: "auto",
                      backgroundColor: "white",
                      zIndex: 1000,
                    }}
                    className="position-absolute top-0 left-0 w-100"
                  >
                    {options.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelectChange(option.value)}
                        style={{
                          padding: "8px",
                          backgroundColor: selectedOptions.includes(
                            option.value
                          )
                            ? "#00CDFF"
                            : "white",
                          color: selectedOptions.includes(option.value)
                            ? "white"
                            : "black",
                          cursor: "pointer",
                          borderBottom: "1px solid #e0e0e0",
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Hàng 2 */}
        <div className="row">
          <div className="col-md-3">
            <label>Mô tả</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập mô tả"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3">
            <label> Hạn thời gian</label>
            <input
              type="time"
              className="form-control"
              name="timeExpired"
              value={formData.timeExpired}
              onChange={handleInputChange}
              step="1"
            />
          </div>
          <div className="col-md-3">
            <label>Phần thưởng</label>
            <input
              type="text"
              className="form-control"
              placeholder="Phần thưởng"
              name="prize"
              value={formData.prize}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3">
            <label style={{ visibility: "hidden" }}>Thêm</label>
            <button
              className="btn w-100"
              onClick={handleSubmit}
              style={{ backgroundColor: "#00CDFF" }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2
          style={{
            textAlign: "center",
            position: "relative",
            margin: "20px 0",
            color: "#00CDFF",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "0 20px",
              backgroundColor: "#fff",
              zIndex: 1,
              position: "relative",
            }}
          >
            Danh sách mục tiêu
          </span>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "100%",
              height: "1px",
              backgroundColor: "#00CDFF",
              zIndex: 0,
            }}
          ></span>
        </h2>
      </div>

      <div style={{ marginLeft: 20 }}>
        <h4>Đang tiến hành</h4>
        <AimInCompleted newAim={newAim} />
      </div>
      <div style={{ marginLeft: 20, marginTop: 20 }}>
        <h4>Đã hoàn thành</h4>
        <AimEnded />
      </div>
    </div>
  );
};

export default Aim;
