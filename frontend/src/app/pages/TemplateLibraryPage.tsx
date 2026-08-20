// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, ChevronDown, Bookmark, Check } from 'lucide-react';
import '../../styles/new-home.css';
import BackgroundCanvas from '../components/layout/BackgroundCanvas';
import Header from '../components/layout/Header';
import SignInModal from '../components/modals/SignInModal';
import BoxStudioModal from './BoxStudioModal';
import { Dieline2DSVG, Dieline3DSVG } from '../components/svg/DielineSVGs';

const categories = [
  { id: 'folding', title: 'Folding Box Templates' },
  { id: 'tuck_end', title: 'Tuck End Box Templates' },
  { id: 'paper_bag', title: 'Paper Bag Templates' },
  { id: 'box_lid', title: 'Box with Lid Templates' },
  { id: 'display_box', title: 'Display Box Templates' },
  { id: 'tray_box', title: 'Tray Box Templates' },
  { id: 'rigid_box', title: 'Rigid Box Templates' },
  { id: 'envelope', title: 'Envelope Templates' }
];

export const TemplateDetailCard = ({
  title,
  type,
  href,
  onClick
}: {
  title: string,
  type: 'straight' | 'reverse' | 'auto_lock' | 'cake',
  href?: string,
  onClick?: () => void
}) => {
  return (
    <a
      href={href || '#'}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="group/detail block cursor-pointer flex flex-col gap-3"
      style={{ textDecoration: 'none' }}
    >
      <div className="relative rounded-[20px] h-[220px] p-5 bg-[#f4f5f5] border-2 border-[#1a1a1a] shadow-[6px_6px_0px_0px_#1a1a1a] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#1a1a1a] overflow-hidden flex items-center justify-between">

        {/* Star Top Left */}
        <div className="absolute top-4 left-4 z-10 transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/detail:stroke-amber-400 group-hover/detail:fill-amber-400/20">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>

        {/* Badges Top Right */}
        <div className="absolute top-4 right-4 flex gap-1.5 z-10">
          <span className="bg-white px-2.5 py-1 rounded-md text-[11px] font-semibold text-zinc-500 shadow-sm border border-zinc-200">
            Printable
          </span>
          <span className="bg-white px-2.5 py-1 rounded-md text-[11px] font-semibold text-zinc-500 shadow-sm border border-zinc-200">
            Downloadable
          </span>
        </div>

        {/* Dieline 2D Vector Left */}
        <div className="w-1/2 h-full flex items-center justify-center relative pr-2 mt-4">
          {type === 'reverse' && <img src="/rte-dieline.png" alt="Dieline" className="max-w-[110%] max-h-[110%] object-contain" />}
          {type === 'straight' && <img src="/ste-dieline.png" alt="Dieline" className="max-w-[110%] max-h-[110%] object-contain" />}
          {type === 'auto_lock' && <img src="/alb-dieline.png" alt="Dieline" className="max-w-[110%] max-h-[110%] object-contain" />}
          {type === 'cake' && <img src="/cake-dieline.png" alt="Dieline" className="max-w-[110%] max-h-[110%] object-contain" />}
        </div>

        {/* 3D Box Right */}
        <div className="w-1/2 h-full flex items-center justify-center pl-2 relative mt-4">
          <div className="relative flex items-center justify-center w-full h-full">
            {/* CSS Hard Floor Shadow */}
            <div 
              className="absolute bg-[#d4d4d4] z-0" 
              style={{
                width: '42%',
                height: '8%',
                bottom: '22%',
                right: '25%',
                transform: 'skewX(-60deg) rotate(-5deg)',
                transformOrigin: 'bottom left'
              }}
            />
            {type === 'reverse' && <img src="/rte-3d.png" alt="3D Model" className="w-full h-full object-contain relative z-10" />}
            {type === 'straight' && <img src="/common-3d.png" alt="3D Model" className="w-full h-full object-contain relative z-10" />}
            {type === 'auto_lock' && <img src="/common-3d.png" alt="3D Model" className="w-full h-full object-contain relative z-10" />}
            {type === 'cake' && <img src="/cake-3d.png" alt="3D Model" className="w-full h-full object-contain relative z-10" />}
          </div>
        </div>
      </div>

      {/* Title Outside the Card */}
      <div className="px-1">
        <h4 className="text-[14px] font-medium text-zinc-500 group-hover/detail:text-zinc-800 transition-colors">
          {title}
        </h4>
      </div>
    </a>
  );
};

export default function TemplateLibraryPage({ onBack, hideHeader }: { onBack: () => void; hideHeader?: boolean }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('tuck_end');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [selectedBoxModel, setSelectedBoxModel] = useState<"rte" | "te" | "auto_lock" | "cake" | null>(null);

  React.useEffect(() => {
    document.body.style.zoom = '1';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';

    return () => {
      document.body.style.zoom = '';
      document.body.style.width = '';
    };
  }, []);

  React.useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  return (
    <div className={`new-home-landing font-sans flex flex-col relative z-0 ${hideHeader ? 'w-full flex-1' : 'min-h-screen'}`}>
      <BackgroundCanvas position="absolute" zIndex={-1} />

      {/* Header */}
      {!hideHeader && <Header activeNav="dielines" onNavigate={onBack} />}

      <div className="flex flex-1 relative z-10 min-h-[600px]">

        {/* Sidebar Index */}
        <aside className="w-[320px] shrink-0 border-r overflow-y-auto py-4 px-6" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--bg-primary)' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 px-4" style={{ color: 'var(--ink)', opacity: 0.5 }}>Categories</h2>
          <nav className="flex flex-col gap-1">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col">
                <button
                  onClick={() => {
                    if (cat.id === 'tuck_end' || cat.id === 'folding') {
                      setExpandedCategory(expandedCategory === cat.id ? null : cat.id);
                      setSelectedBoxModel('rte');
                    } else if (cat.id === 'paper_bag' || cat.id === 'envelope') {
                      setSelectedBoxModel('cake');
                    } else if (cat.id === 'box_lid' || cat.id === 'rigid_box') {
                      setSelectedBoxModel('auto_lock');
                    } else {
                      setSelectedBoxModel('te');
                    }
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 text-left hover:bg-zinc-100 cursor-pointer"
                >
                  <span className={`text-[15px] ${expandedCategory === cat.id ? 'font-semibold text-zinc-900' : 'font-medium text-zinc-600'}`}>
                    {cat.title}
                  </span>

                  <div className={`transition-transform duration-200 ${expandedCategory === cat.id ? 'rotate-90' : ''}`} style={{ color: expandedCategory === cat.id ? 'var(--ink)' : 'inherit', opacity: expandedCategory === cat.id ? 1 : 0.5 }}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {cat.id === 'tuck_end' && expandedCategory === 'tuck_end' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 px-4 py-2 ml-4 border-l-2 border-zinc-200">
                        <button onClick={() => setSelectedBoxModel('te')} className="text-left py-1.5 px-3 rounded-lg text-xs font-medium text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50">Straight Tuck End Box</button>
                        <button onClick={() => setSelectedBoxModel('rte')} className="text-left py-1.5 px-3 rounded-lg text-xs font-medium text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50">Reverse Tuck End Box</button>
                        <button onClick={() => setSelectedBoxModel('auto_lock')} className="text-left py-1.5 px-3 rounded-lg text-xs font-medium text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50">Auto Lock Bottom Box</button>
                        <button onClick={() => setSelectedBoxModel('cake')} className="text-left py-1.5 px-3 rounded-lg text-xs font-medium text-indigo-600 font-semibold hover:bg-indigo-50">Cake Box with Handle & Window</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-[32px] md:text-[36px] font-bold tracking-tight" style={{ color: 'var(--ink)' }}>Dieline & Box Templates</h1>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold border border-indigo-200">
                4 Box Designs Available
              </span>
            </div>
            <p className="text-sm md:text-base mb-6 max-w-2xl" style={{ color: 'var(--ink)', opacity: 0.7 }}>
              Browse our complete collection of 4 production-ready dieline templates for standard tuck end, auto-lock, and custom handle boxes with live 3D studio previewers.
            </p>

            {/* GRID OF 4 ACTIVE BOX CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <TemplateDetailCard title="Straight Tuck End Box" type="straight" onClick={() => setSelectedBoxModel('te')} />
              <TemplateDetailCard title="Reverse Tuck End Box" type="reverse" onClick={() => setSelectedBoxModel('rte')} />
              <TemplateDetailCard title="Auto Lock Bottom Box" type="auto_lock" onClick={() => setSelectedBoxModel('auto_lock')} />
              <TemplateDetailCard title="Cake Box with Handle & Window" type="cake" onClick={() => setSelectedBoxModel('cake')} />
            </div>
          </div>

        </main>
      </div>

      {/* Studio Modal */}
      {selectedBoxModel && (
        <BoxStudioModal
          isOpen={!!selectedBoxModel}
          onClose={() => setSelectedBoxModel(null)}
          initialModel={selectedBoxModel}
        />
      )}

      {isSignInModalOpen && (
        <SignInModal onClose={() => setIsSignInModalOpen(false)} />
      )}
    </div>
  );
}
