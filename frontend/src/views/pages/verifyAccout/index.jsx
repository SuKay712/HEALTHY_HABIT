import { Button, Input, message } from 'antd';
import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import './index.scss';
import axiosClient from '../../../api/axiosClient';
import { useAuth } from '../../../context/authContext';

function VerifyAccout() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) return <Navigate to='/general' />;

  const confirmDisabled = otp.length !== 4 || !email || !validateEmail(email);
  const sentOTPDisabled = !email || !validateEmail(email);

  const sentOtp = async () => {
    setLoading(true);
    try {
      await axiosClient.application.post('/api/auth/resend-otp', {
        email,
      });
      messageApi.info('Mã OTP đã được gửi đến email của bạn');
    } catch (err) {
      messageApi.error(err.response.data.message);
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      await axiosClient.application.post('/api/auth/verify-otp', {
        email,
        otp,
      });

      navigate('/verify-account-success');
    } catch (err) {
      messageApi.error(err.response.data.message);
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <div className='verify'>
        <p className='verify-header'>Trường nhập OTP</p>
        <div className='verify-container'>
          <p className='verify-title'>Nhập mã OTP</p>
          <Input.OTP
            type='number'
            length={4}
            value={otp}
            onChange={setOtp}
            disabled={loading}
          />
          <p className='verify-description'>
            Vui lòng nhập mã OTP chúng tôi đã gửi về địa chỉ email của bạn
          </p>
          <Button
            type='primary'
            className='verify-button'
            disabled={confirmDisabled || loading}
            onClick={verifyOtp}
          >
            Xác minh
          </Button>
          <p className='verify-navigate'>
            Chưa nhận được mã?
            <Button
              className='verify-link'
              type='link'
              disabled={sentOTPDisabled || loading}
              onClick={sentOtp}
            >
              Gửi lại
            </Button>
          </p>
        </div>
      </div>
    </>
  );
}

export default VerifyAccout;

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
