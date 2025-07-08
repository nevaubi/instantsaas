
import React from 'react';
import { Shield, CreditCard, Database, Mail, BarChart, Search } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Authentication',
    description: 'NextAuth/Clerk ready with social logins, email verification, and secure session management.',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Stripe integrated with subscriptions, webhooks, and customer portal out of the box.',
    gradient: 'from-blue-400 to-cyan-500'
  },
  {
    icon: Database,
    title: 'Database',
    description: 'Prisma + PostgreSQL with migrations, seeders, and optimized queries ready to scale.',
    gradient: 'from-purple-400 to-violet-500'
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Resend/SendGrid integration with beautiful templates and automated workflows.',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    icon: BarChart,
    title: 'Admin Dashboard',
    description: 'Complete admin panel with analytics, user management, and business insights.',
    gradient: 'from-orange-400 to-amber-500'
  },
  {
    icon: Search,
    title: 'SEO Optimized',
    description: 'Built-in SEO best practices, meta tags, and performance optimizations for better ranking.',
    gradient: 'from-indigo-400 to-blue-500'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Everything You Need to 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Launch Fast</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stop wasting weeks on boilerplate code. Our production-ready foundation includes all the essentials 
            to get your SaaS from idea to paying customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
