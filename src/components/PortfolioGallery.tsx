import React, { useState } from 'react';
import { Sparkles, MapPin, X, CheckCircle, ArrowRight, Heart, ExternalLink } from 'lucide-react';
import { InstagramIcon } from './icons/InstagramIcon';
import { PORTFOLIO_PROJECTS } from '../data/projectsData';
import type { PortfolioProject } from '../types';

interface PortfolioGalleryProps {
  onOpenOrderWizard: () => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ onOpenOrderWizard }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);

  const categories = [
    { id: 'all', label: 'Tüm Projeler' },
    { id: 'ruhsat', label: 'Ruhsat Projeleri' },
    { id: 'visual3d', label: '3D Görsel Tasarım' },
    { id: 'irrigation', label: 'Sulama Projeleri' }
  ];

  const filteredProjects = selectedCategory === 'all'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolyo" className="py-24 bg-obsidian-950 relative overflow-hidden border-t border-orange-950">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Instagram Branding */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-950/80 text-orange-400 border border-orange-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <InstagramIcon className="w-3.5 h-3.5 text-orange-400" />
              <span>@detay_proje_mimarlik Canlı Portfolyo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
              Tamamlanan Örnek <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
                Peyzaj & Proje Çalışmalarımız
              </span>
            </h2>
            <p className="text-sm text-slate-300">
              Resmi Instagram sayfamızda paylaştığımız, arsa topoğrafyasına ve müşterilerimizin zevkine özel olarak tamamlanan mimari çalışmalarımız.
            </p>
          </div>

          {/* Filter Tabs & Instagram Direct Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <a
              href="https://www.instagram.com/detay_proje_mimarlik/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-orange-300 bg-orange-950/80 hover:bg-orange-900 border border-orange-700/60 transition-all shadow-glow-sm cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4 text-orange-400" />
              <span>Instagram'da İncele</span>
              <ExternalLink className="w-3 h-3 text-orange-400" />
            </a>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-orange-600 text-white shadow-glow-sm'
                      : 'bg-obsidian-900 text-slate-400 border border-orange-950 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid (Instagram Feed Card Style) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveModalProject(project)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-obsidian-900 border border-orange-950 hover:border-orange-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Image Container with Instagram Overlay */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.mainImage}
                  alt={project.altText || project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent opacity-85" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-obsidian-950/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-orange-300 border border-orange-600/50">
                  {project.categoryName}
                </div>

                {/* Instagram Like & View overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-obsidian-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-200 border border-orange-950">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{project.likesCount || 350}</span>
                </div>

                {/* Bottom Card Meta */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" /> {project.location}
                  </span>
                  <span className="font-mono font-bold text-white bg-obsidian-900/90 px-2 py-0.5 rounded-md border border-orange-950">
                    {project.area}
                  </span>
                </div>
              </div>

              {/* Project Card Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-orange-950 flex items-center justify-between">
                  <span className="text-[11px] text-orange-400 font-semibold">
                    {project.duration}
                  </span>
                  <span className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    İncele <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Profile Callout Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-obsidian-900 via-orange-950/30 to-obsidian-900 border border-orange-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <InstagramIcon className="w-4 h-4" /> @detay_proje_mimarlik
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Instagram'da En Güncel Şantiye & 3D Projelerimizi Takip Edin
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Haftalık olarak tamamlanan şantiye uygulama videoları, villa bahçe teslimleri ve ruhsat projelerimiz resmi Instagram hesabımızda paylaşılmaktadır.
            </p>
          </div>

          <a
            href="https://www.instagram.com/detay_proje_mimarlik/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-glow transition-all flex items-center gap-2 shrink-0 group cursor-pointer"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Instagram Sayfamızı Aç</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

      </div>

      {/* Lightbox / Project Details Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-3xl bg-obsidian-900 border border-orange-500/50 rounded-3xl overflow-hidden shadow-2xl">
            
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-obsidian-950/80 text-white border border-orange-950 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-80 overflow-hidden relative">
              <img
                src={activeModalProject.mainImage}
                alt={activeModalProject.altText || activeModalProject.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    {activeModalProject.categoryName} • {activeModalProject.location}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mt-1">
                    {activeModalProject.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-orange-400">{activeModalProject.area}</div>
                  <div className="text-[11px] text-slate-400">{activeModalProject.duration}</div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeModalProject.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Proje Kapsamındaki Çıktılar:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="bg-orange-950/80 border border-orange-800/60 text-orange-300 text-xs px-3 py-1 rounded-full flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-orange-400" /> {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    setActiveModalProject(null);
                    onOpenOrderWizard();
                  }}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-orange-200" />
                  <span>Bu Projeye Benzer Teklif Al (5 Gün Teslim)</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
};
