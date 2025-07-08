
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              InstantSaaS
            </span>
            <p className="text-gray-400 mt-1">Launch your SaaS in minutes, not months.</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Discord
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-gray-400">
            © 2024 InstantSaaS. All rights reserved. Built for developers, by developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
