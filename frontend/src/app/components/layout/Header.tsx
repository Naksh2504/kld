import React, { useState, useEffect } from 'react';
import { User, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import SignInModal from '../modals/SignInModal';
import './Header.css';

interface HeaderProps {
  activeNav?: 'landing' | 'models' | 'dielines' | 'pricing' | 'about' | 'profile' | 'workspace';
  onNavigate?: (view: 'landing' | 'models' | 'dielines' | 'pricing' | 'about' | 'profile' | 'workspace') => void;
}

export default function Header({ activeNav = 'landing', onNavigate }: HeaderProps) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      try {
        const u = localStorage.getItem('user');
        setCurrentUser(u ? JSON.parse(u) : null);
      } catch { setCurrentUser(null); }
    };
    const handleOpenSignInModal = () => {
      setIsSignInModalOpen(true);
    };
    const handleScroll = (e: any) => {
      // Check if scroll is coming from window or a specific scroll container
      const scrollY = (e?.target as any)?.scrollTop || window.scrollY || 0;
      setScrolled(scrollY > 30);
    };

    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('open-sign-in-modal', handleOpenSignInModal);
    window.addEventListener('scroll', handleScroll, true); // true for capturing phase
    
    // Initial check
    handleScroll(null);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('open-sign-in-modal', handleOpenSignInModal);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleNavClick = (view: 'landing' | 'models' | 'dielines' | 'pricing' | 'about' | 'profile' | 'admin' | 'workspace', targetPath: string) => {
    if (view === 'profile' && currentUser?.role === 'ADMIN') {
      view = 'admin';
      targetPath = '/admin';
    }
    window.history.pushState(null, '', targetPath);
    if (onNavigate) {
      onNavigate(view as any);
    } else {
      window.dispatchEvent(new CustomEvent('navigate', { detail: view }));
    }
  };

  const navItems = [
    { id: 'models', label: '3D Models', path: '/3d-models' },
    { id: 'dielines', label: 'Dielines', path: '/dielines' },
    { id: 'pricing', label: 'Pricing', path: '/pricing' },
    { id: 'about', label: 'About us', path: '/about-us' },
  ];

  return (
    <>
      <div style={{ height: '80px', width: '100%', flexShrink: 0, position: 'relative', zIndex: -1 }} className="navbar-spacer" />
      <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-shape">
          <div className="navbar-bg"></div>
          <div className="navbar-tab">
            <div className="kld-ripple" style={{ animationDelay: '0s' }}></div>
            <div className="kld-ripple" style={{ animationDelay: '1.33s' }}></div>
            <div className="kld-ripple" style={{ animationDelay: '2.66s' }}></div>
          </div>
        </div>

        <div className="navbar-content">
          <div 
            className="brand-text cursor-pointer" 
            onClick={() => handleNavClick('landing', '/')}
          >
            KEYLINE DESIGN
          </div>
          
          <div className="nav-links">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.id as any, item.path); }}
                  className={isActive ? 'active' : ''}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          
          <div className="actions">
            {!isLoggedIn ? (
              <button 
                className="btn-primary"
                onClick={() => setIsSignInModalOpen(true)}
              >
                Start Designing 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            ) : (
              <div className="group relative cursor-pointer mr-0.5">
                <div 
                  onClick={() => handleNavClick(currentUser?.role === 'ADMIN' ? 'admin' : 'profile', currentUser?.role === 'ADMIN' ? '/admin' : '/profile')}
                  className="w-10 h-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-extrabold text-sm uppercase shadow-md border border-zinc-800 hover:ring-2 hover:ring-indigo-400 transition-all z-10 relative"
                  title={currentUser?.role === 'ADMIN' ? 'Admin Control Center' : 'View Profile'}
                >
                  {currentUser?.fullName?.[0] || currentUser?.email?.[0] || 'A'}
                </div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-zinc-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
                    <div className="text-xs font-bold text-zinc-900 truncate">{currentUser?.fullName || (currentUser?.role === 'ADMIN' ? 'Administrator' : 'User Account')}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{currentUser?.email || 'Logged in'}</div>
                  </div>
                  {currentUser?.role === 'ADMIN' ? (
                    <button
                      onClick={() => handleNavClick('admin', '/admin')}
                      className="w-full text-left px-4 py-2.5 text-xs text-zinc-800 hover:bg-zinc-50 font-bold transition-colors border-b border-zinc-100 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-600" /> Admin Control Center
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick('profile', '/profile')}
                      className="w-full text-left px-4 py-2.5 text-xs text-zinc-700 hover:bg-zinc-50 font-semibold transition-colors border-b border-zinc-100 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-zinc-500" /> My Profile & Plan
                    </button>
                  )}
                  <button
                    onClick={() => {
                      localStorage.removeItem('isLoggedIn');
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.dispatchEvent(new Event('auth-change'));
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-semibold transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-500" /> Logout
                  </button>
                </div>
              </div>
            )}
            
            <a 
              href="/workspace"
              onClick={(e) => { e.preventDefault(); handleNavClick('workspace', '/workspace'); }}
              className="btn-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg> 
              Workspace
            </a>
          </div>
        </div>

        <div className="svg-container">
          <svg className="nav-border-anim" viewBox="0 0 5000 180" preserveAspectRatio="xMinYMax meet">
            <defs>
              <linearGradient id="box-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE8D4" /><stop offset="100%" stopColor="#EED3B6" />
              </linearGradient>
              <linearGradient id="box-left" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D9A876" /><stop offset="100%" stopColor="#C28B55" />
              </linearGradient>
              <linearGradient id="box-right" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#BC844F" /><stop offset="100%" stopColor="#9A612C" />
              </linearGradient>
              <filter id="box-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.12" />
              </filter>
            </defs>
            
            <g className="box-group" filter="url(#box-shadow)" stroke="#895625" strokeWidth="2.5" strokeLinejoin="round">
              <polygon points="50,85 100,60 150,85 100,110" fill="url(#box-top)" />
              <polygon points="50,85 100,110 100,160 50,135" fill="url(#box-left)" />
              <polygon points="100,110 150,85 150,135 100,160" fill="url(#box-right)" />
            </g>

            <path className="box-path" pathLength="100"></path>
            <polygon className="arrow" points="-5,-4 -5,4 7,0"></polygon>
          </svg>
        </div>
      </div>

      {isSignInModalOpen && <SignInModal onClose={() => setIsSignInModalOpen(false)} />}
    </>
  );
}
