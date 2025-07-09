
import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-brand-dark-gray ${
      isScrolled 
        ? 'bg-brand-white/90 backdrop-blur-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-brand-dark-gray">
              InstantSaaS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <button onClick={() => scrollToSection('features')} className="text-brand-dark-gray hover:text-brand-orange transition-colors">
              Tech Stack
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-brand-dark-gray hover:text-brand-orange transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-brand-dark-gray hover:text-brand-orange transition-colors">
              FAQ
            </button>
            <button onClick={() => scrollToSection('demo')} className="text-brand-dark-gray hover:text-brand-orange transition-colors">
              Demo
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="md:hidden flex items-center space-x-6 mx-auto">
            <button onClick={() => scrollToSection('pricing')} className="text-brand-dark-gray hover:text-brand-orange transition-colors text-base">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-brand-dark-gray hover:text-brand-orange transition-colors text-base">
              FAQ
            </button>
          </div>
        </div>


      </div>
    </nav>
  );
};

export default Navigation;
