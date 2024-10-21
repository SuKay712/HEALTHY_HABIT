import { useAuth } from '../../../context/authContext';
import Background from './components/Background';
import LoginForm from './components/LoginForm';
import { Navigate } from 'react-router-dom';
import './index.scss';

function Login() {
  const { user } = useAuth();

  if (user) return <Navigate to='/schedule' />;

  return (
    <div className='login'>
      <div className='login-container'>
        <Background className='login-bg' />
        <LoginForm className='login-f' />
      </div>
    </div>
  );
}
export default Login;
