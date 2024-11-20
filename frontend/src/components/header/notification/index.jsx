import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaCheck,
  FaComment,
  FaGrimace,
  FaTasks,
  FaThumbsUp,
  FaAmbulance,
} from 'react-icons/fa';
import './index.scss';
import { Select, Spin } from 'antd';
import { useNotification } from '../../../context/notificationContext';
import { LoadingOutlined } from '@ant-design/icons';

const Notification = ({ show, setShow }) => {
  const ref = useRef();
  const { notifications, loading, notReadCount } = useNotification();
  const [filteredValue, setFilterdValue] = useState('ALL');
  const filteredNotifications = useMemo(() => {
    if (filteredValue === 'ALL') {
      return notifications;
    } else {
      return notifications.filter((noti) => noti.notiType === filteredValue);
    }
  }, [filteredValue, notifications]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <div ref={ref} className='noti'>
      <div className='noti-header'>
        <p className='noti-header-title'>Thông báo</p>
        <Select
          onChange={setFilterdValue}
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
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        filteredNotifications.map(({ notiType, content }, index) => (
          <div
            key={index}
            className={`noti-row${
              index < notReadCount && filteredValue === 'ALL'
                ? ' noti-row-not-read'
                : ''
            }`}
          >
            <div className='noti-row-icon'>
              {notiIcons[notiType] ?? notiIcons['OTHER']}
            </div>
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
  );
};

export default Notification;

const notiIcons = {
  LIKE: <FaThumbsUp />,
  COMMENT: <FaComment />,
  LIKE_COMMENT: <FaThumbsUp />,
  TASK: <FaTasks />,
  OVERDUE: <FaGrimace />,
  COMPLETED: <FaCheck />,
  OTHER: <FaAmbulance />,
};
