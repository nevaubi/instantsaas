
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold text-brand-orange">
              InstantSaaS
            </span>
            <p className="text-brand-dark-gray mt-1">Launch your SaaS in minutes, not months.</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-brand-dark-gray hover:text-brand-orange transition-colors">
              Twitter
            </a>
            <a href="#" className="text-brand-dark-gray hover:text-brand-orange transition-colors">
              GitHub
            </a>
            <a href="#" className="text-brand-dark-gray hover:text-brand-orange transition-colors">
              Discord
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500">
            © 2024 InstantSaaS. All rights reserved. Built for developers, by developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
