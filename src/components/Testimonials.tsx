import React, { useState, useEffect } from 'react';
import { Star, Quote, MapPin, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { getCustomerReviews } from '../utils/testimonialsService';
import type { CustomerReview } from '../utils/testimonialsService';
import { ReviewModal } from './ReviewModal';

export const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(getCustomerReviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => {
      setReviews(getCustomerReviews());
    };
    window.addEventListener('reviews_updated', handleUpdate);
    return () => window.removeEventListener('reviews_updated', handleUpdate);
  }, []);

  return (
    <section className="py-24 bg-obsidian-900 relative overflow-hidden border-t border-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 bg-orange-950/80 text-orange-400 border border-orange-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>★ %100 Doğrulanmış Müşteri Deneyimleri</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Projelerini 5 Günde Teslim Alan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
              Müşterilerimizin Yorumları
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Türkiye genelinde tamamladığımız villa, bağ evi ve kurumsal peyzaj projeleri sonrası paylaşılan gerçek kullanıcı görüşleri.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-500/50 text-orange-300 hover:text-white text-xs font-bold shadow-glow-sm cursor-pointer transition-all"
            >
              <MessageSquarePlus className="w-4 h-4 text-orange-400" />
              <span>Projenizi Teslim Aldınız mı? Siz de Yorum Yapın</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-7 bg-obsidian-950 border border-orange-950/80 hover:border-orange-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-orange-900/40 group-hover:text-orange-400/40 transition-colors" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* User Bio */}
              <div className="pt-5 mt-4 border-t border-orange-950/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={`${item.name} - Müşteri Yorumu`}
                    loading="lazy"
                    decoding="async"
                    className="w-11 h-11 rounded-full object-cover border border-orange-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
                        {item.name}
                      </h4>
                      {item.isVerified && (
                        <span title="Doğrulanmış Proje Teslimatı" className="inline-flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-400" /> {item.location}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-orange-400 font-bold">
                  {item.projectArea}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
        />

      </div>
    </section>
  );
};
