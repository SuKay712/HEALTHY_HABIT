import { Input, Button, Checkbox, message, Radio, DatePicker } from 'antd';
import './index.scss';
import { useState } from 'react';
import dayjs from 'dayjs';
import axiosClient from '../../../../../api/axiosClient';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const dateFormat = 'YYYY-MM-DD';

function RegisterForm({ className }) {
  const [data, setData] = useState({
    username: '',
    displayName: '',
    email: '',
    sex: true,
    birthday: dayjs(new Date().toISOString(), dateFormat).toISOString(),
    password: '',
    rePassword: '',
  });

  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleChangeShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const register = async (
    username,
    displayName,
    email,
    sex,
    birthday,
    password
  ) => {
    setLoading(true);
    try {
      await axiosClient.application.post('/api/auth/register', {
        username,
        displayName,
        email,
        sex,
        birthday,
        password,
      });

      navigate(`/verify-account?email=${data.email}`);
    } catch (err) {
      messageApi.error(err.response.data.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (
      data.username.trim().length === 0 ||
      data.displayName.trim().length === 0 ||
      data.email.trim().length === 0 ||
      data.sex === undefined ||
      data.sex === null ||
      data.birthday.trim().length === 0 ||
      data.password.trim().length === 0
    ) {
      messageApi.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!validateEmail(data.email)) {
      messageApi.error('Vui lòng điền đúng email');
      return;
    }

    if (data.password !== data.rePassword) {
      messageApi.error('Mật khẩu không khớp với Xác nhận mật khẩu');
      return;
    }

    await register(
      data.username,
      data.displayName,
      data.email,
      data.sex,
      data.birthday,
      data.password
    );
  };

  return (
    <>
      {contextHolder}
      <form className={`register-form ${className ?? ''}`}>
        <h1 className='register-form-title'>Đăng ký</h1>
        <div className='register-form-inputs-container'>
          <Input
            className='register-form-input'
            placeholder='Tên đăng nhập'
            id='username'
            name='username'
            value={data.username}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            className='register-form-input'
            placeholder='Tên hiển thị'
            id='displayName'
            name='displayName'
            value={data.displayName}
            onChange={handleChange}
            disabled={loading}
          />
          <Input
            className='register-form-input'
            placeholder='Email'
            id='email'
            name='email'
            value={data.email}
            onChange={handleChange}
            disabled={loading}
          />
          <div className='register-form-gender'>
            <label className='register-form-label'>Giới tính:</label>
            <Radio.Group
              id='sex'
              name='sex'
              value={data.sex}
              onChange={handleChange}
              disabled={loading}
            >
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </div>
          <div className='register-form-birthday'>
            <label className='register-form-label'>Ngày sinh:</label>
            <DatePicker
              className='register-form-input-date'
              name='birthday'
              id='birthday'
              value={dayjs(data.birthday, dateFormat)}
              format={dateFormat}
              onChange={(_, dateString) => {
                handleChange({
                  target: {
                    name: 'birthday',
                    value: dateString,
                  },
                });
              }}
              allowClear={false}
            />
          </div>
          {showPassword ? (
            <>
              <Input
                className='register-form-input'
                placeholder='Mật khẩu'
                id='password'
                name='password'
                value={data.password}
                onChange={handleChange}
                disabled={loading}
              />
              <Input
                className='register-form-input'
                placeholder='Nhập lại mật khẩu'
                id='rePassword'
                name='rePassword'
                value={data.rePassword}
                onChange={handleChange}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <Input.Password
                className='register-form-input'
                placeholder='Mật khẩu'
                id='password'
                name='password'
                value={data.password}
                onChange={handleChange}
                visibilityToggle={false}
                disabled={loading}
              />
              <Input.Password
                className='register-form-input'
                placeholder='Nhập lại mật khẩu'
                id='rePassword'
                name='rePassword'
                value={data.rePassword}
                onChange={handleChange}
                visibilityToggle={false}
                disabled={loading}
              />
            </>
          )}
        </div>
        <div className='register-form-options-container'>
          <Checkbox
            value={showPassword}
            onChange={handleChangeShowPassword}
            disabled={loading}
          >
            Hiển thị mật khẩu
          </Checkbox>
          <Button type='link' disabled={loading} className='register-form-link'>
            Quên mật khẩu
          </Button>
        </div>
        <Button
          type='primary'
          className='register-form-button'
          onClick={handleRegister}
          disabled={loading}
        >
          Đăng ký
        </Button>
        <p className='register-form-navigate'>
          Đã có tài khoản?
          <Link to='/login'>
            <Button
              className='register-form-link'
              type='link'
              disabled={loading}
            >
              Đăng nhập
            </Button>
          </Link>
        </p>
      </form>
    </>
  );
}
export default RegisterForm;

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
