import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import {SnackbarProvider} from "notistack";

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <SnackbarProvider autoHideDuration={3000} maxSnack={5}>
    <Provider store={store}>
      <App />
    </Provider>
  </SnackbarProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
