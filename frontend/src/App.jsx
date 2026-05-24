// =============================================
// App.jsx - Root component with auth routing
// =============================================
import { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './style.css';

function App() {
  // Check if admin is already logged in (token saved in localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem('crm_token');
    setIsLoggedIn(false);
  };

  // Show login page or dashboard based on auth state
  return isLoggedIn
    ? <Dashboard onLogout={handleLogout} />
    : <Login onLoginSuccess={handleLoginSuccess} />;
}

export default App;
