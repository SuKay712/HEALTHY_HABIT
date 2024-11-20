import { useAuth } from '../../../context/authContext';
import Background from './components/Background';
import RegisterForm from './components/RegisterForm';
import { Navigate } from 'react-router-dom';
import './index.scss';

function Register() {
  const { user } = useAuth();

  if (user) return <Navigate to='/general' />;

  return (
    <div className='register'>
      <div className='register-container'>
        <Background className='register-bg' />
        <div className='register-f-container'>
          <RegisterForm className='register-f' />
        </div>
      </div>
    </div>
  );
}
export default Register;
