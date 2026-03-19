import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';

const CurrentOffer = () => {
  const { offers } = useContent();
  const offer = offers.find(o => o.is_active) || offers[0];

  if (!offer) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-black rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0">
             <img 
               src={offer.image || 'https://ihost.ge/s3/site-entourage-ge/images/offers/current-offer.jpg'}
               alt="Offer Background"
               className="w-full h-full object-cover opacity-60"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          </div>

          <div className="relative p-10 lg:p-20 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-lg shadow-pink-500/30">
                <Clock className="w-4 h-4" />
                {offer.badge_text || 'შეთავაზება'}
              </div>

              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {offer.title}
                {offer.subtitle && <span className="text-primary-purple block">{offer.subtitle}</span>}
              </h2>

              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                {offer.description}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-8 mb-12">
                {offer.old_price && (
                  <div>
                     <span className="text-sm text-white/60 font-bold uppercase tracking-wider block mb-1">ძველი ფასი</span>
                     <span className="text-3xl font-bold text-white/40 line-through decoration-pink-500">{offer.old_price} ₾</span>
                  </div>
                )}
                {offer.new_price && (
                  <div>
                     <span className="text-sm text-primary-purple font-bold uppercase tracking-wider block mb-1">ახალი ფასი</span>
                     <span className="text-6xl font-bold text-white">{offer.new_price} ₾</span>
                  </div>
                )}
              </div>

              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl"
              >
                შეთავაზების მიღება <ArrowRight size={20} />
              </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentOffer;