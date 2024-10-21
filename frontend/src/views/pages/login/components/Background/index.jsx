import { IMAGES } from '../../../../../constants/images.js';
import './index.scss';

function Background({ className }) {
  return (
    <img
      alt='background'
      src={IMAGES.login_background}
      className={`login-background ${className ?? ''}`}
    />
  );
}
export default Background;
