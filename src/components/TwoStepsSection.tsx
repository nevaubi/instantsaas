import React from 'react';
import { ArrowRight, ArrowDown, Clock } from 'lucide-react';

const TwoStepsSection = () => {
  return (
    <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-3">
            Two steps, 60{" "}
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              seconds
              <Clock className="h-6 w-6 md:h-12 md:w-12 text-white" />
            </span>
          </h2>
          <p className="text-gray-300 italic text-lg">
            <span className="underline">Instant</span> boilerplate access after pymt
          </p>
        </div>

        {/* Desktop Layout - Side by side with horizontal arrow */}
        <div className="hidden md:flex items-center justify-center gap-8">
          <div className="flex-shrink-0">
            <img 
              src="/section1.png" 
              alt="Step 1" 
              className="max-w-md h-auto rounded-lg shadow-lg border-8 border-brand-orange"
            />
          </div>
          <div className="flex-shrink-0">
            <ArrowRight className="h-12 w-12 text-white" />
          </div>
          <div className="flex-shrink-0">
            <img 
              src="/section2.png" 
              alt="Step 2" 
              className="max-w-md h-auto rounded-lg shadow-lg border-8 border-brand-light-blue"
            />
          </div>
        </div>

        {/* Mobile Layout - Stacked with vertical arrow */}
        <div className="md:hidden flex flex-col items-center gap-8">
          <div>
            <img 
              src="/section1.png" 
              alt="Step 1" 
              className="w-full max-w-sm h-auto rounded-lg shadow-lg mx-auto border-8 border-brand-orange"
            />
          </div>
          <div>
            <ArrowDown className="h-12 w-12 text-white" />
          </div>
          <div>
            <img 
              src="/section2.png" 
              alt="Step 2" 
              className="w-full max-w-sm h-auto rounded-lg shadow-lg mx-auto border-8 border-brand-light-blue"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoStepsSection; 
