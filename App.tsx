import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import OfferDetails from './pages/OfferDetails';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-gray-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/offer/:id" element={<OfferDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;