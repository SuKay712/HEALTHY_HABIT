import { Button } from 'antd';
import { FaCheck } from 'react-icons/fa';
import './index.scss';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';

function VerifyAccoutSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to='/general' />;

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className='verify-success'>
      <div className='verify-success-container'>
        <p className='verify-success-title'>
          Chúng tôi đã xác nhận được thông tin của bạn
        </p>
        <p className='verify-success-description'>
          <FaCheck className='verify-success-check-icon' />
          Đăng ký thành công
        </p>
        <Button
          type='primary'
          className='verify-success-button'
          onClick={navigateToLogin}
        >
          Hoàn thành
        </Button>
        <p className='verify-success-navigate'>
          Quay lại trang
          <Link to='/login'>
            <Button className='verify-success-link' type='link'>
              Đăng nhập
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
}
export default VerifyAccoutSuccess;
