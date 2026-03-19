import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';

const PopularProcedures = () => {
  const { procedures: allProcedures, s } = useContent();
  const procedures = allProcedures.filter(p => p.is_popular).length > 0
    ? allProcedures.filter(p => p.is_popular)
    : allProcedures.slice(0, 6);

  return (
    <section className="py-24 bg-muted/20 dark:bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-purple/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
           <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-display">
                პოპულარული <span className="text-primary-purple">{s('popular.title_highlight', 'პროცედურები')}</span>
              </h2>
              <p className="text-xl text-muted-foreground font-body">
                ჩვენი ყველაზე მოთხოვნადი ესთეტიკური სერვისები, რომლებიც დაგეხმარებათ იგრძნოთ თავი თავდაჯერებულად.
              </p>
           </div>
           <Link to="/procedures" className="group flex items-center gap-2 font-bold text-primary-purple hover:text-foreground transition-colors bg-primary-purple/10 hover:bg-primary-purple/20 px-6 py-3 rounded-full">
              ყველას ნახვა <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {procedures.map((procedure, index) => (
            <Link to={`/procedure/${procedure.slug || procedure.id}`} key={procedure.slug || procedure.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative h-96 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-card border border-border"
              >
                <div className="absolute inset-0">
                  <img 
                    src={procedure.image || procedure.popular_image} 
                    alt={procedure.name || procedure.popular_name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-primary-purple/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end h-full">
                  <h3 className="text-2xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {procedure.popular_name || procedure.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    {procedure.popular_description || procedure.description}
                  </p>
                  <div className="flex items-center gap-2 text-white font-bold text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    გაიგე მეტი <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProcedures;