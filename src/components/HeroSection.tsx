
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          {/* Floating badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Stripe Ready</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Auth Built-in</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-full px-4 py-2 flex items-center space-x-2">
              <Code className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">TypeScript</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Slash Costs by 99%.
            </span>
            <br />
            <span className="text-white">
              Stop Waiting and Losing $.
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Launch Fast, Earn Faster
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Prod-ready SaaS boilerplate with auth, stripe, world class ui, and everything you need to launch fast. 
            <span className="text-purple-400 font-semibold"> SPEED is what matters</span> in this new AI focused world. 
            <span className="text-pink-400 font-semibold"> Adapt or be left behind.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 group shadow-2xl">
              <span>Start Building Now</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="border border-purple-500/50 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition-all duration-200 flex items-center space-x-2 group">
              <Play className="h-5 w-5" />
              <span>View Demo</span>
            </button>
          </div>

          {/* Hero visual placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
              <div className="bg-slate-900/80 rounded-lg p-6 font-mono text-left">
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
                  <div className="text-purple-400">🚀 Your SaaS is ready to launch!</div>
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
