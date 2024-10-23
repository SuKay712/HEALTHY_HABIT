import React, { useContext, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getTaskInComplete } from "../../../../../api/aimAPI";
import "./index.scss";
import { AuthContext } from "../../../../../context/authContext";
import Pagination from "../Pagination";
import useBlockScroll from "../../../../../hooks/use-block-scroll";

const AimInCompleted = ({ newAim }) => {
  const [dataInCompleted, setDataInCompleted] = useState([]);

  const [aimViewed, setAimViewed] = useState(null);

  const [paging, setPaging] = useState(1);

  const [totalPages, setTotalPages] = useState(null);

  const { user } = useContext(AuthContext);

  const prevNewAimRef = useRef(newAim);

  // hook ngăn chặn scroll khi đang xem chi tiết mục tiêu
  useBlockScroll(aimViewed !== null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          userId: user.userId,
          page: paging - 1,
          size: 5,
        };

        const response = await getTaskInComplete(params);

        setDataInCompleted(response.content);
        setTotalPages(response.totalPages);

        if (prevNewAimRef.current !== newAim) {
          setPaging(response.totalPages);
          prevNewAimRef.current = newAim;
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi API:", error);
      }
    };
    fetchData();
  }, [paging, newAim]);

  if (dataInCompleted.length === 0) {
    return (
      <div className="text-center">Không có mục tiêu nào đã hoàn thành</div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Hàng tiêu đề */}
      <div className="row mb-3 text-center">
        <div className="col-md-2">
          <strong>Tên</strong>
        </div>
        <div className="col-md-3">
          <strong>Mô tả</strong>
        </div>
        <div className="col-md-2">
          <strong>Số nhiệm vụ</strong>
        </div>
        <div className="col-md-2">
          <strong>Phần thưởng</strong>
        </div>
        <div className="col-md-1">
          <strong>Xem</strong>
        </div>
        <div className="col-md-1">
          <strong>Tùy chỉnh</strong>
        </div>
        <div className="col-md-1">
          <strong>Xóa</strong>
        </div>
      </div>

      {/* Hiển thị dữ liệu */}
      {dataInCompleted.map((item, index) => (
        <div
          className="row mb-3 text-center"
          key={index}
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        >
          {aimViewed && aimViewed.id === item.id && (
            <>
              <div className="overlay"></div>
              <Container
                className="mt-4 table-viewed  overflow-auto"
                style={{
                  width: "auto",
                  maxWidth: "400px",
                  maxHeight: "600px",
                  padding: "15px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  borderRadius: "5px",
                  zIndex: "100",
                }}
              >
                <button
                  className="cancel-btn position-absolute"
                  onClick={() => {
                    setAimViewed(null);
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

                <h2 className="text-center mb-4">Thông tin mục tiêu</h2>

                <Card
                  className="mb-4"
                  style={{ width: "100%", minHeight: "200px" }}
                >
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <strong>Tên:</strong> {aimViewed.name}
                      </Col>
                      <Col md={6}>
                        <strong>Mô tả:</strong> {aimViewed.description}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <strong>Phần thưởng:</strong> {aimViewed.prize}
                      </Col>
                      <Col md={6}>
                        <strong>Thời gian bắt đầu:</strong>{" "}
                        {aimViewed.dateStart}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <strong>Thời gian kết thúc:</strong> {aimViewed.dateEnd}
                      </Col>
                      <Col md={6}>
                        <strong>Thời gian hết hạn:</strong>{" "}
                        {aimViewed.timeExpired}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <h3 className="mt-4">Tiến độ mục tiêu</h3>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Ngày</strong>
                  </Col>
                  <Col md={6}>
                    <strong>Trạng thái</strong>
                  </Col>
                </Row>

                {aimViewed.tasksProgress.map((task, index) => (
                  <Row key={index}>
                    <Col md={6}>{task.date}</Col>
                    <Col md={6}>{task.status}</Col>
                  </Row>
                ))}
              </Container>
            </>
          )}

          <div className="col-md-2 d-flex align-items-center justify-content-center">
            {item.name}
          </div>
          <div className="col-md-3 d-flex align-items-center justify-content-center">
            {item.description}
          </div>
          <div className="col-md-2 d-flex align-items-center justify-content-center">
            {item.tasksProgress.length}
          </div>
          <div className="col-md-2 d-flex align-items-center justify-content-center">
            {item.prize}
          </div>
          <div className="action-btn col-md-1  d-flex justify-content-center  ">
            <button
              className="btn d-flex h-100 justify-content-center align-items-center "
              style={{
                backgroundColor: "#FFC107", // Màu vàng cho nút Xem
              }}
              onClick={() => {
                setAimViewed(item);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                width={15}
                height={15}
                fill="#ffffff"
              >
                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
              </svg>
            </button>
          </div>
          <div className="action-btn col-md-1 d-flex justify-content-center  ">
            <button
              className="btn d-flex h-100 justify-content-center align-items-center "
              style={{
                backgroundColor: "#00CDFF",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width={15}
                height={15}
                fill="#ffffff"
              >
                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
              </svg>
            </button>
          </div>
          <div className="action-btn col-md-1 d-flex justify-content-center ">
            <button className="btn btn-danger h-100 justify-content-center align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width={15}
                height={15}
                fill="#ffffff"
              >
                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <Pagination
        paging={paging}
        setPaging={setPaging}
        totalPages={totalPages}
      />
    </div>
  );
};

export default AimInCompleted;
