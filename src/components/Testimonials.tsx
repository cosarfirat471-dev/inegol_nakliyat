import React from 'react';
import { RiDoubleQuotesL, RiStarFill } from 'react-icons/ri';
import { useData } from '../context/DataContext';

const Testimonials = () => {
  const { data } = useData();
  const reviews = data?.reviews || [];

  if (reviews.length === 0) return null;

  return (
    <section className="w-full py-16 bg-[#0f172a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Mutlu <span className="text-blue-500">Müşterilerimiz</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Yüzlerce başarılı taşıma ve mutlu müşteri referansı ile hizmetinizdeyiz.
        </p>
      </div>

      <div className="relative w-full overflow-hidden mask-fade-sides">
        <div className="flex animate-scroll hover:pause gap-6 w-max pl-6">
          {/* Duplicate list for seamless infinite loop */}
          {[...reviews, ...reviews].map((item: any, idx) => (
            <div 
              key={idx} 
              className="w-[300px] md:w-[400px] flex-shrink-0 bg-[#1e293b]/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl hover:bg-[#1e293b] hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <h3 className="font-bold text-white text-lg">{item.name}</h3>
                  <span className="text-sm text-blue-400">{item.date}</span>
                </div>
                <RiDoubleQuotesL className="text-4xl text-slate-600 group-hover:text-blue-500 transition-colors" />
              </div>
              
              <div className="mb-4">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <RiStarFill key={i} className="text-yellow-500 text-sm" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic line-clamp-4">
                  "{item.text}"
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Müşteri Yorumu</span>
                <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-lg"
                    style={{ backgroundColor: item.avatarColor || '#007aff' }}
                >
                    {item.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
