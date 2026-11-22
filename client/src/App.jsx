import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Services from './pages/Services';
import Contact from './pages/Contact';


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
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;