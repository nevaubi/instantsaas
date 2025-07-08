
import React from 'react';

const testimonials = [
  {
    name: 'Alex Chen',
    handle: '@alexbuilds',
    avatar: '👨‍💻',
    content: 'Launched my SaaS in 2 days instead of 2 months. The auth and payments just work out of the box. This is exactly what I needed.',
    verified: true
  },
  {
    name: 'Sarah Johnson',
    handle: '@sarahcodes',
    avatar: '👩‍💻',
    content: 'As a solo founder, InstantSaaS saved me countless hours. The code quality is production-ready and the documentation is excellent.',
    verified: true
  },
  {
    name: 'Mike Rodriguez',
    handle: '@mikeships',
    avatar: '🚀',
    content: 'Used this for 3 client projects. The TypeScript setup and database migrations are clean. My clients love the fast turnaround.',
    verified: true
  },
  {
    name: 'Emma Davis',
    handle: '@emmacreates',
    avatar: '✨',
    content: 'The admin dashboard and analytics saved me weeks of development. Already made back the cost with my first customer.',
    verified: true
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Loved by 
            <span className="text-primary"> Developers</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join hundreds of developers who've launched their SaaS products faster than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 hover:bg-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:rotate-1"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-bold text-card-foreground">{testimonial.name}</h4>
                    {testimonial.verified && (
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{testimonial.handle}</p>
                  <p className="text-card-foreground leading-relaxed">{testimonial.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
