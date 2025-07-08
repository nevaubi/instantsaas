
import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Shield, Zap, Code } from 'lucide-react';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-white">
      {/* Simple background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gray-50/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-18">
        <div className="text-center">
          {/* Floating badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-3 md:mb-4 mt-4 md:mt-6 animate-fade-in">
            <div className="relative">
              <div className="absolute top-1 left-1 w-full h-full bg-brand-dark-gray rounded-full -z-10"></div>
              <div className="bg-brand-white border border-gray-200 rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm relative">
                <Zap className="h-4 w-4 text-brand-orange" />
                <span className="text-sm text-brand-dark-gray">Slash Dev Time/Cost by ~99%</span>
              </div>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-dark-gray mb-4 md:mb-5 leading-tight lg:leading-[1.3]">
            <span className="font-extrabold leading-tight lg:leading-[1.3]">
              Stop waiting and losing $
              <br />
              Launch Fast, <span className="bg-brand-highlight px-2 rounded-lg">Earn <span className="underline">Faster</span></span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-brand-dark-gray mb-3 md:mb-6 max-w-4xl mx-auto leading-snug md:leading-relaxed">
            <span className="underline">Prod-ready</span> SaaS boilerplate with auth, stripe, world class ui, and <span className="bg-brand-highlight px-2 rounded-lg">everything</span> you need to launch fast. Skip weeks of setup pain, no headaches - <span className="font-bold">just launch</span>.
          </p>

          {/* Logos */}
          <div className="mb-4 md:mb-7">
            <img 
              src="/logoss.png" 
              alt="Technology logos" 
              className="mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-auto"
            />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-10">
            <div className="relative">
              <div className="absolute top-1 left-1 w-full h-full bg-brand-dark-gray rounded-lg -z-10"></div>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg flex items-center space-x-2 group relative"
              >
                <span>Start Building Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute top-1 left-1 w-full h-full bg-brand-dark-gray rounded-lg -z-10"></div>
              <button className="bg-brand-white border border-brand-dark-gray hover:bg-gray-50 text-brand-dark-gray px-8 py-4 rounded-lg font-semibold text-lg flex items-center space-x-2 group relative">
                <Play className="h-5 w-5" />
                <span>View Demo</span>
              </button>
            </div>
          </div>

          {/* Hero visual placeholder */}
          <div className="relative max-w-[50rem] mx-auto hidden md:block">
            <div className="bg-brand-white border border-gray-200 rounded-2xl p-8 shadow-xl">
              <div className="bg-brand-dark-gray rounded-lg p-6 font-mono text-left relative">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 ml-4">~/instant-saas</span>
                </div>
                <div className="flex">
                  <div className="flex-1 space-y-2 text-sm relative">
                    <div className="text-green-400">$ npm create instant-saas</div>
                    <div className="text-gray-400">✓ Installing dependencies...</div>
                    <div className="text-gray-400">✓ Setting up authentication...</div>
                    <div className="text-gray-400">✓ Configuring Stripe payments...</div>
                    <div className="text-gray-400">✓ Database ready...</div>
                    <div className="text-blue-400">🚀 Your SaaS is ready to launch!</div>
                    <div className="absolute -top-16 right-0">
                      <img 
                        src="/workswith.png" 
                        alt="Works with" 
                        className="w-96 h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
