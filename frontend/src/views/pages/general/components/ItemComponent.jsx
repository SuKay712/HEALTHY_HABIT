import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ItemComponent.scss"
function ItemComponent({ imageSrc, title, description ,time}) {
  return (
    <div className="row mb-1 p-2">
    <div className="col-md-4 d-flex justify-content-center"> {/* Sử dụng flexbox */}
      <img
        src={imageSrc}
        alt="Hình ảnh"
        className="img-fluid rounded"
        
      />
    </div>
    <div className="col-md-8"> {/* Cột cho văn bản */}
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="item-description">{time}</p>
    </div>
    <hr className="mt-3" />
  </div>
);
}

export default ItemComponent;
