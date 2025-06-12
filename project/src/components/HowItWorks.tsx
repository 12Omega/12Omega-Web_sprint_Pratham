import React from 'react';
import { Search, MapPin, CreditCard, Car } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Find Parking',
    description: 'Search for available parking spots near your destination using our smart map interface.'
  },
  {
    icon: MapPin,
    title: 'Select & Reserve',
    description: 'Choose your preferred spot and reserve it instantly with real-time availability updates.'
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Pay securely through the app with multiple payment options and transparent pricing.'
  },
  {
    icon: Car,
    title: 'Park & Go',
    description: 'Navigate to your reserved spot and enjoy hassle-free parking with digital access.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with SmartPark in just four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <step.icon className="h-10 w-10 text-white" />
              </div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;