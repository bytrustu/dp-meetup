import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes.tsx';
import './index.css';

const App = () => {
  return (
    <AppRoutes />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
