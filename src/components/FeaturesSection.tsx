
import React, { useState } from 'react';
import { Database, CreditCard, Shield, Palette, Rocket, Check } from 'lucide-react';

const tabs = [
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    activeColor: 'border-purple-500 bg-purple-50',
    content: {
      title: 'Fully integrated Supabase Database',
      description: 'PostgreSQL backend pre-configured with subscription mgt and edge functions',
      features: [
        'Pre-built subscription & user mgt',
        'Auto updates on upgrades/cancels, etc',
        'Ready for your personal API keys',
        'Backend securely connected with frontend UI',
        '<strong>Time saved: 4-6 hours</strong>'
      ]
    }
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    activeColor: 'border-blue-500 bg-blue-50',
    content: {
      title: 'Stripe Integration',
      description: '100% complete payment integration with subscriptions and webhooks',
      features: [
        '6 total customizable subscription tiers (3 monthly/ 3 annual)',
        'Pymt workflow fully integrated with frontend',
        'Webhook event listening fully functional',
        'Full customer portal workflow 100% pre-configured',
        '<strong>Time saved: 10-12 hours</strong>'
      ]
    }
  },
  {
    id: 'auth',
    label: 'Auth',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    activeColor: 'border-green-500 bg-green-50',
    content: {
      title: 'Secure Authentication',
      description: 'Supabase auth with social login and session mgmt',
      features: [
        'Email/password & Google auth enabled',
        'Protected routes fully functional',
        'Backend integration with subscription based rendering',
        'Secure RLS policies pre configured',
        '<strong>Time saved: 4-6 hours</strong>'
      ]
    }
  },
  {
    id: 'ui',
    label: 'UI',
    icon: Palette,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    activeColor: 'border-pink-500 bg-pink-50',
    content: {
      title: 'Professional Front-end UI',
      description: 'Modern design system with Tailwind CSS and shadcn/ui components.',
      features: [
        'Fully screen responsive UI',
        'High quality sections & animations',
        'Securely integrated with auth and pymt workflows',
        'Lifetime access to additional templates and UI additions',
        '<strong>Time saved: 8-10 hours</strong>'
      ]
    }
  },
  {
    id: 'deploy',
    label: 'Deploy',
    icon: Rocket,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    activeColor: 'border-orange-500 bg-orange-50',
    content: {
      title: 'Easy Deployments',
      description: 'Pre-configured for fast deployment on Vercel or Netlify',
      features: [
        'Vercel pre configured with vercel.json',
        'Quick setup with AI coders like Lovable, Cursor, etc',
        'Setup instructions included',
        'Works with Vercel free plan',
        '<strong>Time saved: 2-4 hours</strong>'
      ]
    }
  }
];

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState('database');

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <section id="features" className="pt-12 md:pt-20 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8 bg-brand-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-gray mb-6">
            Everything You Need to
            <span className="text-brand-orange"> Launch Fast</span>
          </h2>
          <p className="text-xl text-brand-dark-gray max-w-3xl mx-auto">
            No more <span className="font-bold">wasting weeks</span> on initial boilerplate code. No more all caps prompt yelling. Get setup in <span className="bg-brand-highlight px-2 rounded-lg underline">hours</span>.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  isActive 
                    ? `${tab.activeColor} shadow-sm` 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <IconComponent className={`h-5 w-5 ${isActive ? tab.color : 'text-gray-500'}`} />
                <span className={`font-medium ${isActive ? tab.color : 'text-gray-700'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTabData && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Content */}
              <div>
                <div className={`w-16 h-16 ${activeTabData.bgColor} rounded-2xl flex items-center justify-center mb-4 md:mb-6`}>
                  <activeTabData.icon className={`h-8 w-8 ${activeTabData.color}`} />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-brand-dark-gray mb-3 md:mb-4">
                  {activeTabData.content.title}
                </h3>
                
                <p className="text-base md:text-lg text-brand-dark-gray mb-6 md:mb-8 leading-relaxed">
                  {activeTabData.content.description}
                </p>

                <ul className="space-y-2 md:space-y-3">
                  {activeTabData.content.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className={`h-4 w-4 ${activeTabData.color} mr-3 flex-shrink-0`} />
                      <span 
                        className="text-brand-dark-gray" 
                        dangerouslySetInnerHTML={{ __html: feature }}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual/Placeholder */}
              <div className="flex justify-center">
                <div className={`w-full max-w-md h-80 ${activeTabData.bgColor} rounded-2xl flex items-center justify-center border-2 border-dashed ${activeTabData.color.replace('text-', 'border-')}`}>
                  <activeTabData.icon className={`h-24 w-24 ${activeTabData.color} opacity-50`} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
