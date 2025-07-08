
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              InstantSaaS
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('tech-stack')} className="text-gray-300 hover:text-white transition-colors">
              Tech Stack
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </button>
            <button onClick={() => scrollToSection('demo')} className="text-gray-300 hover:text-white transition-colors">
              Demo
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 group">
              <span>Start Building Now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/90 backdrop-blur-lg rounded-lg mt-2">
              <button onClick={() => scrollToSection('tech-stack')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                Tech Stack
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                Pricing
              </button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                FAQ
              </button>
              <button onClick={() => scrollToSection('demo')} className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white">
                Demo
              </button>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium mt-2">
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
