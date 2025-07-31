import React from 'react';

const stats = [
  { number: '50,000+', label: 'Happy Customers' },
  { number: '1,000+', label: 'Parking Locations' },
  { number: '99.9%', label: 'Uptime' },
  { number: '24/7', label: 'Customer Support' }
];

const Stats: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-blue-100 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;