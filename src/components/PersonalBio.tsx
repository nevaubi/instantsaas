import React from 'react';

const PersonalBio = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-start items-center gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img 
                src="/me.jpg" 
                alt="Firas (itsfiras1)" 
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-sm border border-gray-200"
              />
            </div>

            {/* Bio Content */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-brand-dark-gray mb-4">
                Hey, it's Firas (itsfiras1) 👋
              </h3>
              
              <div className="space-y-4 text-brand-dark-gray">
                <p className="text-sm md:text-base leading-relaxed">
                  From studying CS in college (pre-ai), to more recently 2+ years of daily building and shipping...  I started to get pretty good at the initial template setup.
                </p>
                
                <p className="text-sm md:text-base leading-relaxed">
                  You know, the boring stuff. The auth APIs, the payment workflows, responsive UI, front-end CTA-to-auth workflow with protected routes, conditional rendering (did I lose you yet? 🥱)
                </p>

                <p className="text-sm md:text-base leading-relaxed">
                  After launching 20 SaaS apps I've nailed a stack workflow and template, turning weeks of boilerplate setup to prod-ready in less than a day.
                </p>

                <div className="py-3">
                  <p className="text-sm md:text-base leading-relaxed font-semibold">
                    <span className="bg-brand-highlight px-2 py-1 rounded-lg">This template is exactly what I use to ship <span className="underline">fast</span>.</span>
                  </p>
                </div>

                <p className="text-sm md:text-base leading-relaxed">
                  Everything you need is pre-wired and ready. <span className="font-bold">90% of setup is just swapping out your API keys.</span> ⚡
                </p>

                <p className="text-sm md:text-base leading-relaxed">
                  Recently started building in public over on X. Feel free to reach out, ask questions, or just connect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalBio; 
