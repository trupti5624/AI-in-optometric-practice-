import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FeedbackPage from './pages/FeedbackPage';
import { AuthProvider } from './helper/AuthContext';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import AppointmentPage from './pages/AppointmentPage';
import FormPage from './pages/FormPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/reports" element={<ReportsPage/>} />
        <Route path="/appointments" element={<AppointmentPage/>} />
        <Route path="/eye-test" element={<FormPage/>} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/blog" element={<BlogPage/>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
