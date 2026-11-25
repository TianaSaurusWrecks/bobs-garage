import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';


import Services from './pages/Services';
import Contact from './pages/Contact';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './App.css';

function Home() {
  return (
     <main>
      <section className="hero">
        <div className="hero-image-container">
          <img
            src="/images/Autumn-Car-roberto-nickson-unsplash - Copy.jpg"
            alt="Black car driving on road"
            className="hero-image"
          />

          <div className="hero-overlay">
            <h1 className="hero-welcome">
              Welcome to Bob's Garage
            </h1>
          </div>
        </div>
      
        <p className="tagline">Keeping your vehicle on the road with Excellent Service at a Reasonable Price
        </p>

        <Link to="/services" className="services-button">
        View All Services
        </Link>
        
      </section>
     </main>
  );
}

function App() {
    const { darkMode } = useAuth();

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>

          {/* public pages */}
          <Route
            element={
                <div className={`public-content ${darkMode ? 'dark-mode' : ''}`}>
                  <Outlet />
                </div>
            }
          >                   
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
              
          </Route>

          {/* admin */}       
            <Route 
              path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;