import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/home/HeroSection';
import CurrentOffer from '@/components/home/CurrentOffer';
import PopularProcedures from '@/components/home/PopularProcedures';
import WhyEntourage from '@/components/home/WhyEntourage';
import ReelsSection from '@/components/ReelsSection';
import FounderBlock from '@/components/home/FounderBlock';
import FAQSection from '@/components/home/FAQSection';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Entourage - ბაია კონდრატიევას ესთეტიკური ცენტრი</title>
        <meta name="description" content="პრემიუმ ესთეტიკური ცენტრი თბილისში - ბოტოქსი, ფილერები, ბიორევიტალიზაცია და სხვა თანამედროვე პროცედურები" />
      </Helmet>

      <div className="overflow-hidden">
        <HeroSection />
        <CurrentOffer />
        <PopularProcedures />
        <WhyEntourage />
        <ReelsSection />
        <FounderBlock />
        <FAQSection />
      </div>
    </>
  );
};

export default HomePage;