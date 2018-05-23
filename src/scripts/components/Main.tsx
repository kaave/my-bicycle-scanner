import React from 'react';
import CSSModules from 'react-css-modules';

import styles from './main.css';

export default CSSModules(function Main() {
  console.log(styles);

  return (
    <main id="main" styleName="main" role="main">
      <h1 styleName="header">Header</h1>
      Main!!!!!!!
    </main>
  );
}, styles);
