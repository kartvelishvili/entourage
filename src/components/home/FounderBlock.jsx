import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const FounderBlock = () => {
  const { s } = useContent();

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
             <div className="relative h-[500px] lg:h-auto">
                <img 
                  src={s('founder.image', 'https://ihost.ge/s3/site-entourage-ge/images/about/founder.jpg')}
                  alt={s('founder.name', 'Baia Kondratieva')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-card" />
             </div>
             
             <div className="p-10 lg:p-20 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-primary-purple font-bold mb-6">
                   <Award className="w-5 h-5" />
                   <span>{s('founder.label', 'დამფუძნებელი')}</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">{s('founder.name', 'ბაია კონდრატიევა')}</h2>
                
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                   "{s('founder.quote', 'ჩემი მიზანია, ყველა ჩემს პაციენტს მივანიჭო თავდაჯერებულობა. ჩვენთან სილამაზე უსაფრთხოა.')}"
                </p>

                <div className="grid grid-cols-2 gap-8">
                   <div>
                      <div className="text-4xl font-bold text-foreground mb-1">{s('founder.stats_value1', '15+')}</div>
                      <div className="text-sm text-muted-foreground">{s('founder.stats_label1', 'წლიანი გამოცდილება')}</div>
                   </div>
                   <div>
                      <div className="text-4xl font-bold text-foreground mb-1">{s('founder.stats_value2', '10k+')}</div>
                      <div className="text-sm text-muted-foreground">{s('founder.stats_label2', 'ბედნიერი პაციენტი')}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderBlock;