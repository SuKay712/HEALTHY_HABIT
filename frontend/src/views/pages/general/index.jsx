import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ItemComponent from "./components/ItemComponent";
import imageSrc1 from '../../../assets/images/overview/daysom.jpg'; 
import imageSrc2 from '../../../assets/images/overview/theduc.jpg'; 
import imageSrc3 from '../../../assets/images/overview/dibo.jpg'; 
import imageSrc4 from '../../../assets/images/overview/docsach1.jpg'; 
import imageSrc5 from '../../../assets/images/overview/anuong.jpg'; 
import imageSrc6 from '../../../assets/images/overview/ngu.png'; 
function General() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      margin:10,
      padding:20,
      borderRadius:'10px',
      boxShadow:'0px 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
    <div className="container mt-3" style={{
        fontSize:25,
        fontWeight:600,
    }}>Các thói quen tốt</div>
    <div className="container mt-4">
    <div className="row">
      <div className="col-md-6">
        <ItemComponent
        imageSrc={imageSrc1}
          title="Dậy sớm"
          description="Dậy sớm để thành công"
          time="Mỗi ngày"
        />
      </div>
      <div className="col-md-6">
        <ItemComponent
          imageSrc={imageSrc2}
          title="Tập thể dục"
          description="Sức khỏe là vàng bạc"
           time="Tập thể dục sau khi thức dậy"
        />
      </div>
    </div>
    </div>
    <div className="container mt-4">
    <div className="row">
      <div className="col-md-6">
        <ItemComponent
        imageSrc={imageSrc3}
          title="Đi bộ"
          description="Đi bộ hít không khí trong lành "
           time="Giành 30 phút mỗi ngày"
        />
      </div>
      <div className="col-md-6">
        <ItemComponent
          imageSrc={imageSrc4}
          title="Đọc sách"
          description="Sách luôn là người bạn, người thầy "
           time="Giành 30 phút mỗi ngày để đọc sách"
        />
      </div>
    </div>
    </div>
    <div className="container mt-4">
    <div className="row">
      <div className="col-md-6">
        <ItemComponent
        imageSrc={imageSrc5}
          title="Ăn uống khoa học"
          description="Giúp bạn đầy đủ dinh dưỡng"
           time="Ăn uống đúng bữa"
        />
      </div>
      <div className="col-md-6">
        <ItemComponent
          imageSrc={imageSrc6}
          title="Ngủ đủ giấc"
          description="Ngủ đủ giấc giúp điều hòa cơ thể"
           time="Ngủ 6-8 tiếng mỗi ngày"
        />
      </div>
    </div>
    </div>

    </div>
  );
}

export default General;