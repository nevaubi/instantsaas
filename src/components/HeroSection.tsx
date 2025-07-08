
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
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-secondary/30" />
        <div 
          className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          style={{
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          {/* Floating badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in">
            <div className="bg-card border border-border rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-card-foreground">Stripe Ready</span>
            </div>
            <div className="bg-card border border-border rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm text-card-foreground">Auth Built-in</span>
            </div>
            <div className="bg-card border border-border rounded-full px-4 py-2 flex items-center space-x-2 shadow-sm">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm text-card-foreground">TypeScript</span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            <span className="text-primary">
              Slash Costs by 99%.
            </span>
            <br />
            <span className="text-foreground">
              Stop Waiting and Losing $.
            </span>
            <br />
            <span className="text-accent">
              Launch Fast, Earn Faster
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Prod-ready SaaS boilerplate with auth, stripe, world class ui, and everything you need to launch fast. 
            <span className="text-primary font-semibold"> SPEED is what matters</span> in this new AI focused world. 
            <span className="text-accent font-semibold"> Adapt or be left behind.</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-200 flex items-center space-x-2 group shadow-lg">
              <span>Start Building Now</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="border border-border text-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary transition-all duration-200 flex items-center space-x-2 group">
              <Play className="h-5 w-5" />
              <span>View Demo</span>
            </button>
          </div>

          {/* Hero visual placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <div className="bg-secondary/50 rounded-lg p-6 font-mono text-left">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground ml-4">~/instant-saas</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-primary">$ npm create instant-saas</div>
                  <div className="text-muted-foreground">✓ Installing dependencies...</div>
                  <div className="text-muted-foreground">✓ Setting up authentication...</div>
                  <div className="text-muted-foreground">✓ Configuring Stripe payments...</div>
                  <div className="text-muted-foreground">✓ Database ready...</div>
                  <div className="text-accent">🚀 Your SaaS is ready to launch!</div>
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
