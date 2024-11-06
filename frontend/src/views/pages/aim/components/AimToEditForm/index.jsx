import { useContext, useEffect, useRef, useState } from "react";
import aimAPI from "../../../../../api/aimAPI";
import { toastError, toastSuccess } from "../../../../../utils/toast";
import { AuthContext } from "../../../../../context/authContext";
import "./index.scss";
import useBlockScroll from "../../../../../hooks/use-block-scroll";

export function AimToEditForm({ data, close, fetchData }) {
  useBlockScroll(true);

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

  // Tạo state để theo dõi các tùy chọn đã chọn và trạng thái hiển thị
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const handleSelectChange = (value) => {
    let newSelectedOptions = [...selectedOptions];

    if (selectedOptions.includes(value)) {
      if (value !== "ALL") {
        newSelectedOptions = newSelectedOptions.filter(
          (option) => option !== value
        );

        if (newSelectedOptions.length === 0) {
          setSelectedOptions([]);
        } else {
          setSelectedOptions(newSelectedOptions);
        }
      } else {
        newSelectedOptions = [];
        setSelectedOptions([]);
      }
    } else {
      if (value === "ALL") {
        newSelectedOptions = ["ALL"];
        setSelectedOptions(["ALL"]);
      } else {
        newSelectedOptions = newSelectedOptions.filter(
          (option) => option !== "ALL"
        );

        if (newSelectedOptions.length === 6) {
          newSelectedOptions = ["ALL"];
          setSelectedOptions(["ALL"]);
        } else {
          newSelectedOptions.push(value);
          setSelectedOptions(newSelectedOptions);
        }
      }
    }
    console.log(newSelectedOptions);

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

  const handleSubmit = async () => {
    const dataToSend = {
      taskId: data.id,
      name: formData.name,
      description: formData.description,
      prize: formData.prize,
      dateEnd: formatDate(formData.dateEnd),
      timer: formData.timer,
      timeExpired: formData.timeExpired,
    };
    console.log(dataToSend);
    try {
      //   Gọi API thông qua aimAPI
      const result = await aimAPI.updateTask(dataToSend);
      if (result) {
        toastSuccess("Cập nhật thành công!");
        close();
        fetchData();
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
      toastError("Có lỗi gì đó");
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      const dateStart = data.dateStart.split("-").reverse().join("-");
      const dateEnd = data.dateEnd.split("-").reverse().join("-");
      setFormData({
        name: data.name,
        description: data.description,
        prize: data.prize,
        dateStart: dateStart,
        dateEnd: dateEnd,
        timer: data.timer,
        timeExpired: data.timeExpired,
      });
      setSelectedOptions(data.timer);
    }

    document.addEventListener("mousedown", handleClickOutside); // Lắng nghe sự kiện nhấp chuột
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Dọn dẹp sự kiện
    };
  }, []);

  return (
    <>
      <div className="overlay"></div>

      <div
        className="table-viewed overflow-auto"
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "700px",
          padding: "15px",
          border: "1px solid #ccc",
          background: "#fff",
          borderRadius: "5px",
          zIndex: "1002",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position: "sticky",
            top: "5px",
            zIndex: "100",
          }}
        >
          <button
            className="exit-btn "
            onClick={() => {
              close();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width={25}
              height={25}
              fill="#00cdff"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>

        <h2 class="text-center">Sửa mục tiêu</h2>

        <div className="p-3 m-3">
          {/* Hàng 1 */}
          <div className="row">
            <div className="col-md-12 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Mục tiêu
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập thông tin"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Hàng 2 */}
          <div className="row">
            <div className="col-md-12 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Mô tả
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập mô tả"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Vòng lặp
              </label>
              <div className="position-relative truncate-select">
                <div
                  ref={ref}
                  className="form-control  text-truncate "
                  style={{ height: "auto", cursor: "pointer" }}
                  onClick={handleToggleOptions}
                >
                  {selectedOptions.length > 0
                    ? selectedOptions.join(", ")
                    : "Chọn vòng lặp"}
                </div>
              </div>
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
                        backgroundColor: selectedOptions.includes(option.value)
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

          <div className="row">
            <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Ngày bắt đầu
              </label>
              <input
                type="date"
                className="form-control"
                name="dateStart"
                value={formData.dateStart}
                onChange={handleInputChange}
                min={getCurrentDate()}
                disabled
              />
            </div>

            <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Ngày kết thúc
              </label>
              <input
                type="date"
                className="form-control"
                name="dateEnd"
                value={formData.dateEnd}
                onChange={handleInputChange}
                min={
                  formData.dateStart > getCurrentDate()
                    ? formData.dateStart
                    : getCurrentDate()
                }
                disable={formData.dateStart ? false : true}
                required
              />
            </div>
            <div className="col-md-4 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Hạn thời gian
              </label>
              <input
                type="time"
                className="form-control"
                name="timeExpired"
                value={formData.timeExpired}
                onChange={handleInputChange}
                step="1"
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Phần thưởng
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Phần thưởng"
                name="prize"
                value={formData.prize}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  visibility: "hidden",
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Hủy
              </label>
              <button
                className="btn w-100 cancel-btn"
                onClick={() => {
                  close();
                }}
              >
                Hủy
              </button>
            </div>
            <div className="col-md-6 d-flex justify-center-start text-start gap-2 flex-column">
              <label
                style={{
                  visibility: "hidden",
                  marginLeft: "10px",
                  fontSize: "18px",
                  marginTop: "5px",
                }}
              >
                Thêm
              </label>
              <button className="btn w-100 submit-btn" onClick={handleSubmit}>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
