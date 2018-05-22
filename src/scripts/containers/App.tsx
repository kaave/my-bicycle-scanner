import React from 'react';
import { render } from 'react-dom';

import Main from '../components/Main';

function App() {
  return <Main />;
}

export default function() {
  render(<App />, document.getElementById('mount-point'));
}
