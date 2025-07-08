
import React from 'react';
import { Shield, CreditCard, Database, Mail, BarChart, Search } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Authentication',
    description: 'NextAuth/Clerk ready with social logins, email verification, and secure session management.',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Stripe integrated with subscriptions, webhooks, and customer portal out of the box.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Database,
    title: 'Database',
    description: 'Prisma + PostgreSQL with migrations, seeders, and optimized queries ready to scale.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Resend/SendGrid integration with beautiful templates and automated workflows.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100'
  },
  {
    icon: BarChart,
    title: 'Admin Dashboard',
    description: 'Complete admin panel with analytics, user management, and business insights.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    icon: Search,
    title: 'SEO Optimized',
    description: 'Built-in SEO best practices, meta tags, and performance optimizations for better ranking.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-gray mb-6">
            Everything You Need to
            <span className="text-brand-orange"> Launch Fast</span>
          </h2>
          <p className="text-xl text-brand-dark-gray max-w-3xl mx-auto">
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
                className="group bg-brand-white border border-gray-200 rounded-2xl p-8 hover:border-brand-orange hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark-gray mb-4">{feature.title}</h3>
                <p className="text-brand-dark-gray leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
