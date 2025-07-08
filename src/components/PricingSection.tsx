
import React from 'react';
import { Check, Star, Zap } from 'lucide-react';

const PricingSection = () => {
  const features = [
    'Complete Vite + React boilerplate',
    'Supabase Auth (Email + Google)',
    'Stripe pymt workflows',
    'SEO optimization (Blog Addition)',
    'Docs & Setup Guides',
    'Extra Templates & UI',
    'Lifetime Repo Updates',
    'Unmatched Value for the Price'
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-gray mb-6">
            🚀 <span className="underline">Top-Tier Quality</span>. <span className="bg-brand-highlight px-2 rounded-lg">Bottom-Tier Price.</span>
          </h2>
          <p className="text-xl text-brand-dark-gray max-w-3xl mx-auto">
            Launch-ready SaaS templates usually cost <span className="font-bold text-red-600">hundreds</span>. We're handing you one for <span className="bg-brand-highlight px-2 py-1 rounded-lg font-bold">$69</span> — or just <span className="bg-brand-cta-orange text-white px-2 py-1 rounded-lg font-bold">$39</span> if you <span className="underline font-semibold">follow on X and join the newsletter</span>.
            <br /><br />
            This isn't a discount or charity. <span className="font-bold">It's a disruption!</span> This is what <span className="bg-brand-highlight px-2 rounded-lg font-semibold">democratizing dev tools</span> looks like🔥
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Discounted Tier */}
          <div className="bg-brand-white border-2 border-brand-orange rounded-2xl p-8 relative shadow-lg">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-brand-orange text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>Most Popular</span>
              </div>
            </div>
            <div className="text-center mb-8 pt-4">
              <h3 className="text-xl font-bold text-brand-dark-gray mb-2">Discounted Tier (Follow + Subscribe)</h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-brand-dark-gray">$39</span>
                <span className="text-gray-500 ml-2">One-time pymt</span>
              </div>
              <p className="text-brand-dark-gray">An extra 40% off an already industry-breaking price.</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-brand-dark-gray">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
              <span>Start Building</span>
              <Zap className="h-5 w-5" />
            </button>
          </div>

          {/* Full Price Tier */}
          <div className="bg-brand-white border border-gray-200 rounded-2xl p-8 relative shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-brand-dark-gray mb-2">Full Price Tier</h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-brand-dark-gray">$69</span>
                <span className="text-gray-500 ml-2">One-time pymt</span>
              </div>
              <p className="text-brand-dark-gray">Don't want to follow or subscribe? No problem — same full product.</p>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-brand-dark-gray">{feature}</span>
                </li>
              ))}
            </ul>



            <button className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center space-x-2">
              <span>Start Building</span>
              <Zap className="h-5 w-5" />
            </button>
          </div>
        </div>


      </div>
    </section>
  );
};

export default PricingSection;
