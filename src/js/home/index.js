import './intro';
import bg from '../../image/home_bg.webp';

// change bg
if (location.pathname === '/')
  document.body.style.cssText = `
    background: url('${bg}') white;
    background-repeat: no-repeat;
    background-size: cover;
  `;