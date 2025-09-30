import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/css/style.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './pages/Home';
import { StockProvider } from './context/UserContext';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <StockProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StockProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
