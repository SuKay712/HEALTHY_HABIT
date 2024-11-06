import { useEffect, useRef, useState } from 'react';
import { FaComment, FaTasks, FaThumbsUp } from 'react-icons/fa';
import './index.scss';
import axiosClient from '../../../api/axiosClient';
import { useAuth } from '../../../context/authContext';
import { message, Select, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Notification = ({ show, setShow }) => {
  const ref = useRef();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notis, setNotis] = useState([]);
  const [filteredNotis, setFilteredNotis] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const handleClickOutside = (e) => {
    if (
      ref.current &&
      !ref.current.contains(e.target) &&
      !e.target.closest('button') &&
      !e.target.closest('.ant-select-dropdown')
    ) {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener('mouseup', handleClickOutside);
    } else {
      document.removeEventListener('mouseup', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [show]);

  const handleChangeFilter = (value) => {
    if (value === 'ALL') {
      setFilteredNotis(notis);
    } else {
      setFilteredNotis(notis.filter((noti) => noti.notiType === value));
    }
  };

  useEffect(() => {
    const getNotis = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.application.get(
          `/api/v1/notification/user?userId=${user.userId}`
        );
        const notis = response.data.data;
        setNotis(notis);
        setFilteredNotis(notis);
      } catch (err) {
        messageApi.error('Có lỗi xảy ra khi lấy thông báo');
      }
      setLoading(false);
    };
    getNotis();
  }, [user]);

  return (
    <>
      {contextHolder}
      <div ref={ref} className='noti'>
        <div className='noti-header'>
          <p className='noti-header-title'>Thông báo</p>
          <Select
            onChange={handleChangeFilter}
            defaultValue='ALL'
            style={{ width: '120px' }}
            options={[
              { label: 'Tất cả', value: 'ALL' },
              { label: 'Biểu cảm', value: 'LIKE' },
              { label: 'Bình luận', value: 'COMMENT' },
              { label: 'Việc cần làm', value: 'TASK' },
            ]}
          />
        </div>
        {loading ? (
          <div className='noti-loading'>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </div>
        ) : (
          filteredNotis.map(({ notiType, content }, index) => (
            <div key={index} className='noti-row'>
              <div className='noti-row-icon'>{notiIcons[notiType]}</div>
              <div className='noti-row-content'>
                <p className='noti-row-content-text'>{content}</p>
                <p className='noti-row-content-placeholder'>
                  Bạn có một thông báo
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Notification;

const notiIcons = {
  LIKE: <FaComment />,
  COMMENT: <FaComment />,
  TASK: <FaTasks />,
};
