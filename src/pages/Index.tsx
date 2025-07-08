
import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import TwoStepsSection from '../components/TwoStepsSection';
import FeaturesSection from '../components/FeaturesSection';
import TechStackSection from '../components/TechStackSection';
import PricingSection from '../components/PricingSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-brand-white">
      <Navigation />
      <HeroSection />
      <TwoStepsSection />
      <FeaturesSection />
      <TechStackSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
