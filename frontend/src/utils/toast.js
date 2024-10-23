import { toast } from "react-toastify";

function toastCreator({ type, message }) {
  return toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    progress: undefined,
  });
}

export function toastError(message) {
  return toastCreator({ type: "error", message: message });
}

export function toastSuccess(message) {
  return toastCreator({ type: "success", message: message });
}
