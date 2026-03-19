import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ title, description, className = "bg-primary-purple" }) => {
  return (
    <div className={`relative py-20 md:py-32 overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://ihost.ge/s3/site-entourage-ge/images/ui/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 font-display"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mx-auto font-body leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;