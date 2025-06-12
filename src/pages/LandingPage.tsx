import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Clock, Shield, Smartphone, CreditCard } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Footer />
    </div>
  );
};

export default LandingPage;