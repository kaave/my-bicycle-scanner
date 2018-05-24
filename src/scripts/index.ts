import './common/initializer';

import '../styles/index.css';
import mount from './containers/App';

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  mount();
});
