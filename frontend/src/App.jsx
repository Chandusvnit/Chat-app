// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

function App() {
  const { authUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Chat Route: If not logged in, redirect to login */}
        <Route 
          path="/" 
          element={authUser ? <Home /> : <Navigate to="/login" />} 
        />

        {/* Auth Routes: If already logged in, redirect straight to Home dashboard */}
        <Route 
          path="/login" 
          element={!authUser ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!authUser ? <Signup /> : <Navigate to="/" />} 
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;