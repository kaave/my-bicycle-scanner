import React from 'react';
import { render } from 'react-dom';
import { hot } from 'react-hot-loader';

import Main from '../components/Main';

function App() {
  return <Main />;
}

// tslint:disable-next-line
const HotApp = hot(module)(App);

export default function() {
  render(<HotApp />, document.getElementById('mount-point'));
}
