import { useAuth } from '../../../context/authContext';
import Background from './components/Background';
import LoginForm from './components/LoginForm';
import { Navigate } from 'react-router-dom';
import './index.scss';

function Login() {
  const { user } = useAuth();

  if (user) return <Navigate to='/general' />;

  return (
    <div className='login'>
      <div className='login-container'>
        <Background className='login-bg' />
        <div className='login-f-container'>
          <LoginForm className='login-f' />
        </div>
      </div>
    </div>
  );
}
export default Login;
