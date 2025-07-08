
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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Simple background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-slate-50/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          {/* Floating badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-700">Stripe Ready</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-slate-700">Auth Built-in</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm">
              <Code className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-slate-700">TypeScript</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            <span className="text-blue-600">
              Slash Costs by 99%.
            </span>
            <br />
            <span className="text-slate-900">
              Stop Waiting and Losing $.
            </span>
            <br />
            <span className="text-orange-500">
              Launch Fast, Earn Faster
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Prod-ready SaaS boilerplate with auth, stripe, world class ui, and everything you need to launch fast. 
            <span className="text-blue-600 font-semibold"> SPEED is what matters</span> in this new AI focused world. 
            <span className="text-orange-500 font-semibold"> Adapt or be left behind.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 group shadow-lg">
              <span>Start Building Now</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="border border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-50 transition-all duration-200 flex items-center space-x-2 group">
              <Play className="h-5 w-5" />
              <span>View Demo</span>
            </button>
          </div>

          {/* Hero visual placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="bg-slate-900 rounded-lg p-6 font-mono text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 ml-4">~/instant-saas</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-green-400">$ npm create instant-saas</div>
                  <div className="text-gray-400">✓ Installing dependencies...</div>
                  <div className="text-gray-400">✓ Setting up authentication...</div>
                  <div className="text-gray-400">✓ Configuring Stripe payments...</div>
                  <div className="text-gray-400">✓ Database ready...</div>
                  <div className="text-blue-400">🚀 Your SaaS is ready to launch!</div>
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
