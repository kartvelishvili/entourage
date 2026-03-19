import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import BeforeAfterSlider from '@/components/results/BeforeAfterSlider';
import PageHeader from '@/components/PageHeader';
import { useContent } from '@/contexts/ContentContext';

const ResultsPage = () => {
  const { results: ctxResults } = useContent();

  const showcases = ctxResults.length > 0 ? ctxResults.map(r => ({
    title: r.title,
    description: r.description,
    before: r.before_image,
    after: r.after_image,
  })) : [];

  return (
    <>
      <Helmet>
        <title>შედეგები - Entourage</title>
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        <PageHeader 
          title="შედეგები" 
          description="ჩვენი პაციენტების ტრანსფორმაციის ისტორიები" 
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-32">
          {showcases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col lg:flex-row gap-12 items-center"
            >
               <div className={`flex-1 space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="inline-block px-4 py-1 rounded-full bg-primary-purple/10 text-primary-purple text-sm font-bold">
                    შედეგი #{index + 1}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">{item.title}</h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">{item.description}</p>
               </div>
               
               <div className="flex-1 w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                 <BeforeAfterSlider 
                    imageBefore={item.before}
                    imageAfter={item.after}
                    title={item.title}
                    override={true}
                 />
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResultsPage;