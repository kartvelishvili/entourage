import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';

const StickyBookingButton = () => {
  const { s } = useContent();

  if (s('sticky_button.enabled', 'true') === 'false') return null;

  const link = s('sticky_button.link', '/contact');

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Link
        to={link}
        className="bg-primary-purple hover:bg-primary-purple/90 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="დაგვიკავშირდით"
      >
        <Phone className="w-6 h-6" />
      </Link>
    </motion.div>
  );
};

export default StickyBookingButton;