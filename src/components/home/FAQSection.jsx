import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { faqs: ctxFaqs } = useContent();

  const faqs = ctxFaqs.length > 0 ? ctxFaqs : [];

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://ihost.ge/s3/site-entourage-ge/images/ui/noise.svg')] opacity-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-purple/10 rounded-full blur-[100px]"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-primary-purple/10 rounded-2xl flex items-center justify-center text-primary-purple mx-auto mb-6 rotate-12">
            <HelpCircle size={32} />
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">ხშირად დასმული კითხვები</h2>
          <p className="text-muted-foreground">პასუხები თქვენს ყველა კითხვაზე</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-border hover:border-primary-purple/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className={`font-bold text-lg transition-colors ${activeIndex === index ? 'text-primary-purple' : 'text-foreground'}`}>
                  {faq.question}
                </span>
                <span className={`p-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-primary-purple text-white rotate-180' : 'bg-muted text-foreground group-hover:bg-primary-purple/10'}`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-muted-foreground border-t border-border/50 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;