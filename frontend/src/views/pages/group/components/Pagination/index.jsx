import { Pagination as BSPagination } from "react-bootstrap";
import "./index.scss";

export default function Pagination({ paging, setPaging, totalPages = 10 }) {
  return (
    <BSPagination className="justify-content-center">
      {/* Nút điều hướng trái */}
      <BSPagination.Prev
        disabled={paging === 1}
        onClick={() => {
          if (paging > 1) {
            setPaging(paging - 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width={16}
          height={16}
          fill="currentColor"
          className="navigate-btn"
        >
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
        </svg>
      </BSPagination.Prev>

      {/* Hiển thị trang 1 nếu hiện tại không phải trang đầu */}
      {paging > 1 && (
        <BSPagination.Item onClick={() => setPaging(1)} active={paging === 1}>
          1
        </BSPagination.Item>
      )}

      {/* Hiển thị dấu ba chấm nếu paging > 3 */}
      {paging > 3 && <BSPagination.Ellipsis />}

      {/* Trang trước */}
      {paging > 2 && (
        <BSPagination.Item
          onClick={() => setPaging(paging - 1)}
          active={paging === paging - 1}
        >
          {paging - 1}
        </BSPagination.Item>
      )}

      {/* Trang hiện tại */}
      <BSPagination.Item active>{paging}</BSPagination.Item>

      {/* Trang kế */}
      {paging < totalPages - 1 && (
        <BSPagination.Item
          onClick={() => setPaging(paging + 1)}
          active={paging === paging + 1}
        >
          {paging + 1}
        </BSPagination.Item>
      )}

      {/* Hiển thị dấu ba chấm nếu paging < totalPages - 2 */}
      {paging < totalPages - 2 && <BSPagination.Ellipsis />}

      {/* Hiển thị trang cuối nếu chưa đến trang cuối */}
      {paging < totalPages && (
        <BSPagination.Item
          onClick={() => setPaging(totalPages)}
          active={paging === totalPages}
        >
          {totalPages}
        </BSPagination.Item>
      )}

      {/* Nút điều hướng phải */}
      <BSPagination.Next
        disabled={paging === totalPages}
        onClick={() => {
          if (paging < totalPages) {
            setPaging(paging + 1);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          width={16}
          height={16}
          fill="currentColor"
          className="navigate-btn"
        >
          <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
        </svg>
      </BSPagination.Next>
    </BSPagination>
  );
}
