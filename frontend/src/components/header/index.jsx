import './index.scss';
import React, { useState } from 'react';
import { Avatar, Button } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Notification from './notification';

function HeaderComponent(props) {
  const { url, title } = props;
  const [showNoti, setShowNoti] = useState(false);

  const onClickNoti = () => {
    setShowNoti((prev) => !prev);
  };

  return (
    <div class='d-flex align-items-center justify-content-between header-container'>
      <h1 class='header-title'>
        {title.trim().toLowerCase() !== 'cá nhân' && title}
      </h1>
      <div>
        <div className='header-noti-container'>
          <Button
            onClick={onClickNoti}
            icon={<BellOutlined />}
            className='header-noti-button'
          />
          {showNoti && <Notification show={showNoti} setShow={setShowNoti} />}
        </div>
        <Avatar size={45} icon={!url && <UserOutlined color='' />} src={url} />
      </div>
    </div>
  );
}

export default HeaderComponent;
