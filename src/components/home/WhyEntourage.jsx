import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Lightbulb, Heart, Star, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const WhyEntourage = () => {
  const { s } = useContent();

  const features = [
    {
      icon: Award,
      title: 'ექსპერტიზა',
      description: 'საერთაშორისო დონის სერტიფიცირებული ექიმები და 15+ წლიანი გამოცდილება.',
    },
    {
      icon: Shield,
      title: 'უსაფრთხოება',
      description: 'სტერილიზაციის უმაღლესი სტანდარტები და FDA დამტკიცებული პრეპარატები.',
    },
    {
      icon: Lightbulb,
      title: 'ტექნოლოგიები',
      description: 'უახლესი თაობის აპარატურა მსოფლიო წამყვანი მწარმოებლებისგან.',
    },
    {
      icon: Heart,
      title: 'კომფორტი',
      description: 'პრემიუმ გარემო და ინდივიდუალური ზრუნვა თითოეულ პაციენტზე.',
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
       {/* Decorative Elements */}
       <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary-purple/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 -z-10" />
       <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary-purple/10 text-primary-purple px-5 py-2 rounded-full font-bold text-sm mb-6"
          >
            <Star size={16} fill="currentColor" />
            რატომ Entourage?
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-display"
          >
            {s('why.title', 'სილამაზის')} <span className="text-primary-purple">{s('why.title_highlight', 'ახალი სტანდარტი')}</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            ჩვენ ვაერთიანებთ სამედიცინო პროფესიონალიზმს და ესთეტიკურ ხედვას საუკეთესო შედეგისთვის.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-card/50 backdrop-blur-md border border-border p-8 rounded-[2rem] shadow-lg hover:shadow-2xl hover:shadow-primary-purple/10 hover:border-primary-purple/30 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-purple/10 to-transparent flex items-center justify-center text-primary-purple mb-6 group-hover:scale-110 group-hover:bg-primary-purple group-hover:text-white transition-all duration-300 shadow-sm">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-20 bg-gradient-to-r from-primary-purple to-pink-600 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
        >
            <div className="absolute inset-0 bg-[url('https://ihost.ge/s3/site-entourage-ge/images/ui/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-bold mb-6 font-display">მზად ხართ ცვლილებებისთვის?</h3>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                    დაჯავშნეთ ვიზიტი უფასო კონსულტაციაზე და მიიღეთ ინდივიდუალური გეგმა.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full">
                        <CheckCircle2 size={20} className="text-green-400" />
                        <span className="font-bold">უფასო კონსულტაცია</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full">
                         <CheckCircle2 size={20} className="text-green-400" />
                         <span className="font-bold">გარანტირებული შედეგი</span>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyEntourage;