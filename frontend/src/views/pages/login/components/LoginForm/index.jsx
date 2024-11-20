import { Input, Button, Checkbox, message } from 'antd';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import './index.scss';
import { useState } from 'react';
import { useAuth } from '../../../../../context/authContext';
import { Link } from 'react-router-dom';

function LoginForm({ className }) {
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const [messageApi, contextHolder] = message.useMessage();

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.currentTarget.name]: e.currentTarget.value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleChangeShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (
      data.username.trim().length === 0 ||
      data.password.trim().length === 0
    ) {
      messageApi.error('Vui lòng điền đầy đủ tài khoản và mật khẩu');
      return;
    }
    const result = await login(data.username, data.password);

    if (!result) {
      messageApi.error('Tài khoản hoặc mật khẩu không đúng');
    }
  };

  return (
    <>
      {contextHolder}
      <form className={`login-form ${className ?? ''}`}>
        <h1 className='login-form-title'>Đăng nhập</h1>
        <div className='login-form-inputs-container'>
          <Input
            className='login-form-input'
            placeholder='Tên đăng nhập'
            id='username'
            name='username'
            value={data.username}
            onChange={handleChange}
            disabled={loading}
          />
          {showPassword ? (
            <Input
              className='login-form-input'
              placeholder='Mật khẩu'
              id='password'
              name='password'
              value={data.password}
              onChange={handleChange}
              disabled={loading}
            />
          ) : (
            <Input.Password
              className='login-form-input'
              placeholder='Mật khẩu'
              id='password'
              name='password'
              value={data.password}
              onChange={handleChange}
              visibilityToggle={false}
              disabled={loading}
            />
          )}
        </div>
        <div className='login-form-options-container'>
          <Checkbox
            value={showPassword}
            onChange={handleChangeShowPassword}
            disabled={loading}
          >
            Hiển thị mật khẩu
          </Checkbox>
          <Button type='link' disabled={loading} className='login-form-link'>
            Quên mật khẩu
          </Button>
        </div>
        <Button
          type='primary'
          className='login-form-button'
          onClick={handleLogin}
          disabled={loading}
        >
          Đăng nhập
        </Button>
        <p className='login-form-seperate'>Hoặc</p>
        <Button
          icon={
            <div className='login-form-button-icon'>
              <FcGoogle />
            </div>
          }
          className='login-form-button'
          disabled={loading}
        >
          Đăng nhập với Google
        </Button>
        <Button
          icon={
            <div className='login-form-button-icon'>
              <FaFacebook />
            </div>
          }
          type='primary'
          className='login-form-button'
          disabled={loading}
        >
          Đăng nhập với Facebook
        </Button>
        <p className='login-form-navigate'>
          Chưa có tài khoản?
          <Link to='/register'>
            <Button className='login-form-link' type='link' disabled={loading}>
              Đăng ký
            </Button>
          </Link>
        </p>
      </form>
    </>
  );
}
export default LoginForm;
