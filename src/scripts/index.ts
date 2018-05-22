import './common/initializer';

import mount from './containers/App';
import '../styles/index.css';

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  mount();
});
