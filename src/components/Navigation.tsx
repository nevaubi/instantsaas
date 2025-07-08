
import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-brand-dark-gray ${
      isScrolled 
        ? 'bg-brand-white/90 backdrop-blur-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-brand-dark-gray">
              InstantSaaS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('tech-stack')} className="text-brand-dark-gray hover:text-brand-orange transition-colors">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-dark-gray hover:text-brand-orange"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-brand-white border border-gray-200 rounded-lg mt-2 shadow-lg">
              <button onClick={() => scrollToSection('tech-stack')} className="block w-full text-left px-3 py-2 text-brand-dark-gray hover:text-brand-orange">
                Tech Stack
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-3 py-2 text-brand-dark-gray hover:text-brand-orange">
                Pricing
              </button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-3 py-2 text-brand-dark-gray hover:text-brand-orange">
                FAQ
              </button>
              <button onClick={() => scrollToSection('demo')} className="block w-full text-left px-3 py-2 text-brand-dark-gray hover:text-brand-orange">
                Demo
              </button>
              <button className="w-full btn-primary px-4 py-2 rounded-lg font-medium mt-2">
                Start Building Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
