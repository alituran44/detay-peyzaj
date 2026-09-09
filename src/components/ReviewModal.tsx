import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, MessageSquare, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveCustomerReview } from '../utils/testimonialsService';
import type { StoredOrder } from '../types/auth';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: StoredOrder | null;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  order,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>(() => {
    if (order) {
      return (order.invoice.type === 'bireysel' ? order.invoice.fullName : order.invoice.companyName) || '';
    }
    return '';
  });
  const [location, setLocation] = useState<string>(() => {
    if (order) {
      return (order.invoice.district || 'Merkez') + ' / ' + (order.invoice.city || 'Çanakkale');
    }
    return 'Çanakkale / Merkez';
  });
  const [role, setRole] = useState<string>('Villa Sahibi');
  const [projectArea, setProjectArea] = useState<string>(() => {
    if (order) {
      return order.areaM2 + ' m²';
    }
    return '1.000 m²';
  });
  const [projectStyle] = useState<string>('Modern Villa Peyzajı');
  const [comment, setComment] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) {
      alert('Lütfen adınızı ve yorumunuzu doldurunuz.');
      return;
    }

    saveCustomerReview({
      orderId: order ? order.id : undefined,
      name: name.trim(),
      role: role.trim() || 'Müşteri',
      location: location.trim() || 'Çanakkale',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      comment: comment.trim(),
      rating,
      projectArea: projectArea.trim() || '1.000 m²',
      projectStyle: projectStyle.trim() || 'Modern Peyzaj',
      isVerified: true,
    });

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ea580c', '#f59e0b', '#22c55e'],
      });
    } catch (err) {
      console.error(err);
    }

    setIsSuccess(true);
    if (onReviewSubmitted) onReviewSubmitted();
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg bg-obsidian-900 border border-orange-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-orange-950 flex items-center justify-between bg-obsidian-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Proje Deneyiminizi Değerlendirin</h3>
              <p className="text-xs text-orange-400/90">Yorumunuz ana sayfadaki müşteri yorumları bölümünde yayınlanacaktır.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-obsidian-900 text-slate-400 hover:text-white border border-orange-950 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-glow">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-serif font-bold text-white">Yorumunuz İçin Teşekkür Ederiz!</h4>
                <p className="text-xs text-slate-300">
                  Değerli geri bildiriminiz başarıyla kaydedildi ve ana sayfadaki müşteri yorumları arasına eklendi.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Star Rating Selector */}
              <div className="p-4 rounded-2xl bg-obsidian-950 border border-orange-950 text-center space-y-2">
                <span className="text-slate-300 font-bold block uppercase tracking-wider text-[11px]">
                  Peyzaj Proje & Teslimat Memnuniyetiniz:
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-bold text-amber-400 font-mono">
                  {rating === 5 && '★★★★★ Mükemmel (5/5)'}
                  {rating === 4 && '★★★★☆ Çok İyi (4/5)'}
                  {rating === 3 && '★★★☆☆ İyi (3/5)'}
                  {rating === 2 && '★★☆☆☆ Orta (2/5)'}
                  {rating === 1 && '★☆☆☆☆ Geliştirilmeli (1/5)'}
                </div>
              </div>

              {/* Order Info Badge if linked */}
              {order && (
                <div className="p-3 rounded-xl bg-orange-950/40 border border-orange-500/40 text-orange-300 flex items-center justify-between">
                  <span>Sipariş No: <strong>{order.id}</strong></span>
                  <span className="font-mono font-bold text-white">{order.areaM2} m²</span>
                </div>
              )}

              {/* Name & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Adınız / Ünvanınız:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Mehmet Yılmaz"
                    className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Rol / Mülk Tipi:</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Örn: Villa Sahibi, Müstakil Ev"
                    className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Location & Project Area */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Konum (İlçe / İl):</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Çanakkale / Ezine"
                      className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 pl-8 text-xs text-white focus:border-orange-500 outline-none"
                    />
                    <MapPin className="w-3.5 h-3.5 text-orange-400 absolute left-2.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Arsa m² / Proje Türü:</label>
                  <input
                    type="text"
                    value={projectArea}
                    onChange={(e) => setProjectArea(e.target.value)}
                    placeholder="1.850 m²"
                    className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Detailed Comment */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Deneyiminiz & Yorumunuz (DWG, 3D Render, Sulama ve 5 Günlük Teslimat):
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Arsamız için verilen peyzaj projesi ve 3D renderlar 5 gün içinde eksiksiz teslim edildi. Mimarımızın ilgisi ve çizim detayları harikaydı..."
                  className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-orange-500 outline-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Yorumu Yayınla & Paylaş</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
