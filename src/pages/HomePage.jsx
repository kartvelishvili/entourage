import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/home/HeroSection';
import CurrentOffer from '@/components/home/CurrentOffer';
import PopularProcedures from '@/components/home/PopularProcedures';
import WhyEntourage from '@/components/home/WhyEntourage';
import ReelsSection from '@/components/ReelsSection';
import FounderBlock from '@/components/home/FounderBlock';
import FAQSection from '@/components/home/FAQSection';
import { useContent } from '@/contexts/ContentContext';

const HomePage = () => {
  const { s } = useContent();

  return (
    <>
      <Helmet>
        <title>{s('seo.home.title', 'Entourage - ბაია კონდრატიევას ესთეტიკური ცენტრი')}</title>
        <meta name="description" content={s('seo.home.description', 'პრემიუმ ესთეტიკური ცენტრი თბილისში - ბოტოქსი, ფილერები, ბიორევიტალიზაცია და სხვა თანამედროვე პროცედურები')} />
        {s('seo.home.keywords') && <meta name="keywords" content={s('seo.home.keywords')} />}
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