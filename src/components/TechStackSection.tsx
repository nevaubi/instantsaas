
import React from 'react';

const technologies = [
  { name: 'Next.js', logo: '⚡', color: 'text-white' },
  { name: 'TypeScript', logo: 'TS', color: 'text-blue-400' },
  { name: 'Tailwind CSS', logo: '🎨', color: 'text-cyan-400' },
  { name: 'Prisma', logo: '🔺', color: 'text-indigo-400' },
  { name: 'PostgreSQL', logo: '🐘', color: 'text-blue-500' },
  { name: 'Stripe', logo: 'S', color: 'text-purple-400' },
  { name: 'NextAuth', logo: '🔐', color: 'text-green-400' },
  { name: 'Vercel', logo: '▲', color: 'text-white' },
];

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Built with 
            <span className="text-primary"> Industry Leaders</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've carefully selected the best technologies to ensure your SaaS is fast, 
            scalable, and maintainable from day one.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-2xl p-8 hover:bg-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-center"
            >
              <div className="text-4xl mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                {tech.logo}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground text-center">{tech.name}</h3>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-card-foreground mb-4">Plus Everything Else You Need</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-muted-foreground">
              <div>
                <h4 className="font-semibold text-primary mb-2">Development</h4>
                <p className="text-sm">ESLint, Prettier, Husky, TypeScript strict mode</p>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-2">Deployment</h4>
                <p className="text-sm">Docker, CI/CD, Environment configs</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Monitoring</h4>
                <p className="text-sm">Error tracking, Analytics, Performance metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
