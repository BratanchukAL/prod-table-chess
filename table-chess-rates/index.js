import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const element = document.getElementById('table-chess-rates');

$(document).ready(() => {
    ReactDOM.render(<App element={element}/>, element);
});

