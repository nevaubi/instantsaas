
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What exactly do I get with InstantSaaS?',
    answer: 'You get a complete, production-ready SaaS boilerplate including built-in authentication workflows, payment processing, database preconfigured, deployment guides, addition UI templates and components.'
  },
  {
    question: 'How quickly can I launch my SaaS?',
    answer: 'Devs can launch within days instead of weeks or months. The boilerplate includes all the boring & complex integrations pre-built, so you can focus on your unique business features at your own pace.'
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
    answer: 'You recieve helpful documentation that extensively covers implemenation and setup. As well as lifetime updates to all future features and documention updates. Feel free to direct DM on twitter for additional help/questions if needed!'
  },
  {
    question: 'Can I use this for client projects?',
    answer: 'Yes! Many agencies and freelancers use InstantSaaS to deliver client projects faster. There are no licensing restrictions - use it for as many projects as you want.'
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark-gray mb-6">
            Frequently Asked
            <span className="text-brand-orange"> Questions</span>
          </h2>
          <p className="text-xl text-brand-dark-gray">
            Everything you need to know about InstantSaaS.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-brand-white border border-gray-200 rounded-2xl overflow-hidden">
              <button
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-brand-dark-gray pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 text-brand-orange flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-brand-dark-gray leading-relaxed">{faq.answer}</p>
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
