
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What exactly do I get with InstantSaaS?',
    answer: 'You get a complete, production-ready SaaS boilerplate including authentication, payment processing, database setup, admin dashboard, email integration, and deployment guides. Everything is built with modern technologies like Next.js 14, TypeScript, and Tailwind CSS.'
  },
  {
    question: 'How quickly can I launch my SaaS?',
    answer: 'Most developers launch within 1-2 days instead of weeks or months. The boilerplate includes all the complex integrations pre-built, so you can focus on your unique business logic and features.'
  },
  {
    question: 'Do I need to know all these technologies?',
    answer: 'Basic knowledge of React and TypeScript is helpful, but our comprehensive documentation guides you through everything. We include setup instructions, deployment guides, and code comments explaining each part.'
  },
  {
    question: 'Is the code customizable?',
    answer: 'Absolutely! You get the full source code with no restrictions. Modify, extend, or completely rebuild any part to match your needs. The code is clean, well-documented, and follows best practices.'
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'You get access to our Discord community where you can ask questions and get help from other developers. Plus, lifetime updates mean you\'ll always have the latest features and security updates.'
  },
  {
    question: 'Can I use this for client projects?',
    answer: 'Yes! Many agencies and freelancers use InstantSaaS to deliver client projects faster. There are no licensing restrictions - use it for as many projects as you want.'
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Frequently Asked 
            <span className="text-blue-600"> Questions</span>
          </h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about InstantSaaS.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-slate-900 pr-4">{faq.question}</h3>
                <ChevronDown 
                  className={`h-5 w-5 text-blue-600 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
