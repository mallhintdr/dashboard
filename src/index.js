import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import 'leaflet/dist/leaflet.css';  // Leaflet CSS
import 'leaflet-draw/dist/leaflet.draw.css';  // Leaflet-Draw CSS
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap CSS
import '@fortawesome/fontawesome-free/css/all.css'; // FontAwesome CSS
import { AuthProvider } from './AuthContext'; // Import the AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);