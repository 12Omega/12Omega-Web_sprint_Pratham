import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Car className="h-8 w-8 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold">SmartPark</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Revolutionizing parking with smart technology and seamless user experience.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="block text-gray-300 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-300">support@smartpark.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-gray-300">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 SmartPark. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;