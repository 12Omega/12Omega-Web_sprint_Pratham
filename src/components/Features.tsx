import React from 'react';
import { MapPin, Clock, Shield, Smartphone, CreditCard, Zap } from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-time Availability',
    description: 'See available parking spots in real-time with our advanced sensor technology and live updates.'
  },
  {
    icon: Clock,
    title: 'Instant Booking',
    description: 'Reserve your parking spot instantly with just a few taps. No more circling around looking for parking.'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Safe and secure payment processing with multiple payment options and encrypted transactions.'
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Designed for mobile with an intuitive interface that works seamlessly on all devices.'
  },
  {
    icon: CreditCard,
    title: 'Flexible Pricing',
    description: 'Pay only for what you use with transparent pricing and no hidden fees.'
  },
  {
    icon: Zap,
    title: 'Smart Notifications',
    description: 'Get notified about your booking status, payment confirmations, and parking reminders.'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose SmartPark?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of parking with our cutting-edge technology and user-friendly platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;