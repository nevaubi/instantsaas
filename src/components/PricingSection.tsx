
import React from 'react';
import { Check, Star } from 'lucide-react';

const PricingSection = () => {
  const features = [
    'Complete Next.js 14 boilerplate',
    'Authentication system (NextAuth/Clerk)',
    'Stripe payment integration',
    'PostgreSQL + Prisma setup',
    'Admin dashboard',
    'Email templates & automation',
    'SEO optimization',
    'TypeScript throughout',
    'Tailwind CSS styling',
    'Production deployment guide',
    'Discord community access',
    'Lifetime updates'
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-gray mb-6">
            Simple
            <span className="text-brand-orange"> Transparent</span> Pricing
          </h2>
          <p className="text-xl text-brand-dark-gray max-w-3xl mx-auto">
            No hidden fees, no surprises. Get everything you need to launch your SaaS
            for less than the cost of a coffee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-brand-white border border-gray-200 rounded-2xl p-8 relative shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-brand-dark-gray mb-2">Starter</h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-brand-dark-gray">$1</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-brand-dark-gray">Perfect for individual developers</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.slice(0, 8).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-brand-dark-gray">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full btn-secondary py-3 rounded-lg font-semibold">
              Start Building
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-brand-white border-2 border-brand-orange rounded-2xl p-8 relative shadow-lg">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-brand-orange text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>Most Popular</span>
              </div>
            </div>

            <div className="text-center mb-8 pt-4">
              <h3 className="text-2xl font-bold text-brand-dark-gray mb-2">Pro</h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-brand-dark-gray">$3</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
              <p className="text-brand-dark-gray">For serious builders and agencies</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-brand-dark-gray">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Lifetime updates badge */}
            <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Star className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-semibold">Lifetime Updates Included</span>
              </div>
            </div>

            <button className="w-full btn-primary py-3 rounded-lg font-semibold">
              Start Building Pro
            </button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500">
            30-day money-back guarantee • Cancel anytime • No setup fees
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
