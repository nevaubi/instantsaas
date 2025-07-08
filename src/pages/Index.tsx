
import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import TwoStepsSection from '../components/TwoStepsSection';
import FeaturesSection from '../components/FeaturesSection';
import PersonalBio from '../components/PersonalBio';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-brand-white">
      <Navigation />
      <HeroSection />
      <TwoStepsSection />
      <FeaturesSection />
      <PersonalBio />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
