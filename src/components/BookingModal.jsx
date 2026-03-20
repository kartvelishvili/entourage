import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const API_BASE = import.meta.env.VITE_API_URL || '';

const BookingModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    procedure: '',
    date: '',
    time: '',
    message: '',
  });

  const procedures = [
    'ბოტოქსი',
    'დერმალური ფილერი',
    'ბიორევიტალიზაცია',
    'ლაზერული თერაპია',
    'მიკროდერმაბრაზია',
    'კვამატოლიზი',
    'სხვა',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.procedure) {
      toast({
        title: 'შეცდომა',
        description: 'გთხოვთ შეავსოთ ყველა სავალდებულო ველი',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          procedure_name: formData.procedure,
          date: formData.date,
          time: formData.time,
          comment: formData.message,
          source: 'modal',
        }),
      });
      if (!res.ok) throw new Error();

      toast({
        title: 'წარმატება! ✨',
        description: 'თქვენი მოთხოვნა წარმატებით გაიგზავნა. ჩვენ მალე დაგიკავშირდებით',
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        procedure: '',
        date: '',
        time: '',
        message: '',
      });
      setIsSubmitting(false);
      onClose();
    } catch {
      toast({
        title: 'შეცდომა',
        description: 'გთხოვთ სცადოთ თავიდან',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gradient-to-br from-lavender-50 to-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-lavender-100 transition-colors"
          >
            <X className="w-5 h-5 text-charcoal-600" />
          </button>

          {/* Modal Content */}
          <div className="p-8">
            <h2 className="text-3xl font-serif font-bold text-charcoal-700 mb-2">
              დაჯავშნე კონსულტაცია
            </h2>
            <p className="text-charcoal-500 mb-8">
              შეავსეთ ფორმა და ჩვენი სპეციალისტი მალე დაგიკავშირდებით
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  სახელი და გვარი *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all text-charcoal-700"
                  placeholder="თქვენი სახელი და გვარი"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    ტელეფონი *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all text-charcoal-700"
                    placeholder="+995 XXX XX XX XX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    ელ. ფოსტა
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all text-charcoal-700"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  აირჩიეთ პროცედურა *
                </label>
                <select
                  name="procedure"
                  value={formData.procedure}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all text-charcoal-700"
                  required
                >
                  <option value="">აირჩიეთ პროცედურა</option>
                  {procedures.map((proc) => (
                    <option key={proc} value={proc}>
                      {proc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    სასურველი თარიღი
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all text-charcoal-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">
                    სასურველი დრო
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all text-charcoal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  დამატებითი ინფორმაცია
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-lavender-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 transition-all resize-none text-charcoal-700"
                  placeholder="დამატებითი კომენტარი ან კითხვები..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blush-500 hover:bg-blush-600 text-white font-medium py-4 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'იგზავნება...' : 'გაგზავნა'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;