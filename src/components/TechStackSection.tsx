
import React from 'react';

const technologies = [
  { name: 'Next.js', logo: '⚡', color: 'text-slate-800' },
  { name: 'TypeScript', logo: 'TS', color: 'text-blue-600' },
  { name: 'Tailwind CSS', logo: '🎨', color: 'text-cyan-600' },
  { name: 'Prisma', logo: '🔺', color: 'text-indigo-600' },
  { name: 'PostgreSQL', logo: '🐘', color: 'text-blue-700' },
  { name: 'Stripe', logo: 'S', color: 'text-purple-600' },
  { name: 'NextAuth', logo: '🔐', color: 'text-green-600' },
  { name: 'Vercel', logo: '▲', color: 'text-slate-800' },
];

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-gray mb-6">
            Built with
            <span className="text-brand-orange"> Industry Leaders</span>
          </h2>
          <p className="text-xl text-brand-dark-gray max-w-3xl mx-auto">
            We've carefully selected the best technologies to ensure your SaaS is fast,
            scalable, and maintainable from day one.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group bg-brand-white border border-gray-200 rounded-2xl p-8 hover:border-brand-orange hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className={`text-4xl mb-4 ${tech.color} group-hover:scale-110 transition-transform duration-300`}>
                {tech.logo}
              </div>
              <h3 className="text-lg font-semibold text-brand-dark-gray text-center">{tech.name}</h3>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-brand-white border border-gray-200 rounded-2xl p-8 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-2xl font-bold text-brand-dark-gray mb-4">Plus Everything Else You Need</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-brand-dark-gray">
              <div>
                <h4 className="font-semibold text-brand-light-blue mb-2">Development</h4>
                <p className="text-sm">ESLint, Prettier, Husky, TypeScript strict mode</p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-orange mb-2">Deployment</h4>
                <p className="text-sm">Docker, CI/CD, Environment configs</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Monitoring</h4>
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
