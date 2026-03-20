import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';

const ReelsSection = () => {
  const { reels: ctxReels, s } = useContent();

  if (!ctxReels || ctxReels.length === 0) return null;

  return (
    <section className="py-24 bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {s('reels.title', 'ვიდეო')} <span className="text-primary-purple">{s('reels.title_highlight', 'გალერეა')}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              {s('reels.subtitle', 'ნახეთ პროცედურების მიმდინარეობა და შედეგები')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ctxReels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl overflow-hidden shadow-xl bg-card border border-border"
            >
              <div className="aspect-[9/16] bg-black">
                <iframe
                  src={reel.video_url}
                  className="w-full h-full"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title={reel.title || 'Video'}
                />
              </div>
              {(reel.title || reel.description) && (
                <div className="p-4">
                  {reel.title && <h3 className="text-foreground font-bold text-sm">{reel.title}</h3>}
                  {reel.description && <p className="text-muted-foreground text-xs mt-1">{reel.description}</p>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelsSection;