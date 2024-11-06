import React, { useEffect } from "react";
import "./index.scss";

const Modal = ({ children, onClickOutside }) => {
  const onClickExceptChild = (e) => {
    if (e.currentTarget !== e.target) return;
    if (onClickOutside) onClickOutside();
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  return (
    <aside
      className="modal"
      onMouseDown={onClickExceptChild}
    >
      {children}
    </aside>
  );
};

export default Modal;
