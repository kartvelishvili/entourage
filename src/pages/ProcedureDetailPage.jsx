import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, CheckCircle, Play } from 'lucide-react';
import BeforeAfterSlider from '@/components/results/BeforeAfterSlider';
import { useContent } from '@/contexts/ContentContext';

const ProcedureDetailPage = () => {
  const { procedureId } = useParams();
  const { procedures } = useContent();

  const procedure = procedures.find(p => p.slug === procedureId);

  const data = procedure ? {
    name: procedure.name,
    description: procedure.detail_description || procedure.description,
    benefits: procedure.benefits || [],
    steps: procedure.steps || [],
    video: procedure.video_url || '',
  } : {
    name: 'ესთეტიკური პროცედურა',
    description: 'უმაღლესი ხარისხის ესთეტიკური მომსახურება Entourage-ში.',
    benefits: ['ინდივიდუალური მიდგომა', 'პროფესიონალი ექიმები', 'კომფორტული გარემო'],
    steps: ['კონსულტაცია', 'პროცედურა', 'შემოწმება'],
    video: '',
  };

  return (
    <>
      <Helmet>
        <title>{data.name} - Entourage</title>
      </Helmet>

      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="bg-primary-purple/10 py-12 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-purple/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/procedures" className="inline-flex items-center text-muted-foreground hover:text-primary-purple mb-6 transition-colors">
              <ArrowLeft size={20} className="mr-2" /> უკან პროცედურებზე
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-foreground mb-4"
            >
              {data.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-3xl"
            >
              {data.description}
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Info Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-3xl p-8 shadow-xl"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">უპირატესობები</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-foreground font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-bold text-foreground mt-8 mb-6">პროცედურის ეტაპები</h2>
                <div className="space-y-4">
                  {data.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary-purple text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Before/After */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-3xl p-8 shadow-xl"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">შედეგები</h2>
                <BeforeAfterSlider />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Video Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="aspect-video bg-black relative">
                  <iframe 
                    src={data.video} 
                    className="w-full h-full absolute inset-0"
                    frameBorder="0" 
                    width="100%" 
                    height="100%" 
                    allowFullScreen
                    title="Procedure Video"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2">ვიდეო პროცესი</h3>
                  <p className="text-sm text-muted-foreground">ნახეთ როგორ ტარდება პროცედურა ჩვენს კლინიკაში</p>
                </div>
              </motion.div>

              {/* Booking Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-primary-purple text-white rounded-3xl p-8 shadow-xl text-center"
              >
                <h3 className="text-2xl font-bold mb-4">დაჯავშნე ვიზიტი</h3>
                <p className="mb-8 opacity-90">გაიარეთ კონსულტაცია ჩვენს სპეციალისტებთან და მიიღეთ საუკეთესო შედეგი</p>
                <Link 
                  to="/booking" 
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-purple w-full py-4 rounded-xl font-bold hover:bg-white/90 transition-colors"
                >
                  <Calendar size={20} />
                  დაჯავშნა
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcedureDetailPage;