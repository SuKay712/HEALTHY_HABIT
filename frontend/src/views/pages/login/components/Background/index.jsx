import { IMAGES } from '../../../../../constants/images.js';
import './index.scss';

function Background({ className }) {
  return (
    <div
      style={{ backgroundImage: `url(${IMAGES.login_background})` }}
      className={`login-background ${className ?? ''}`}
    >
      <svg
        className='login-background-svg'
        viewBox='0 0 800 600'
        xmlns='http://www.w3.org/2000/svg'
        preserveAspectRatio='none'
      >
        <clipPath id='clip-right'>
          <path d='M 800 0 C 460 425, 1012 198, 700 600 L 800 600 L 800 0 Z' />
        </clipPath>
        <rect
          x='0'
          y='0'
          width='800'
          height='600'
          clip-path='url(#clip-right)'
          fill='#fff9f9'
        />
        <path
          width='800'
          height='600'
          d='M 800 0 C 460 425, 1012 198, 700 600'
          fill='none'
          stroke='#000000'
          strokeWidth='2px'
        />
      </svg>
    </div>
  );
}
export default Background;
