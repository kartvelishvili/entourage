import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const StickyBookingButton = () => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-8 right-8 z-40"
    >
      <Link 
        to="/booking"
        className="bg-primary-purple hover:bg-primary-purple/90 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 group"
      >
        <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">დაჯავშნე კონსულტაცია</span>
      </Link>
    </motion.div>
  );
};

export default StickyBookingButton;