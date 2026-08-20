import React from 'react';

export type SVGType = 'straight' | 'reverse' | 'auto_lock' | 'cake';

export const Dieline2DSVG = ({ type }: { type: SVGType }) => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-h-[145px] transition-transform duration-300 group-hover/detail:scale-105">
      {type === 'straight' && (
        <g strokeWidth="0.8" fill="none">
          <path d="M25,25 h50 M25,75 h50 M40,20 v60 M60,20 v60 M75,25 v50 M25,25 v50" stroke="#EF4444" strokeDasharray="1.5 1.5" />
          <path d="M40,25 v-10 c0,-1 1,-2 2,-2 h16 c1,0 2,1 2,2 v10 M40,75 v10 c0,1 1,2 2,2 h16 c1,0 2,-1 2,-2 v-10" stroke="#4F46E5" />
          <path d="M25,25 v-5 h15 M60,25 v-5 h15 M25,75 v5 h15 M60,75 v5 h15" stroke="#4F46E5" />
          <path d="M25,25 h-5 v50 h5 M75,25 h5 v50 h-5" stroke="#4F46E5" />
        </g>
      )}
      {type === 'reverse' && (
        <g strokeWidth="0.8" fill="none">
          <path d="M25,25 h50 M25,75 h50 M40,20 v60 M60,20 v60 M75,25 v50 M25,25 v50" stroke="#EF4444" strokeDasharray="1.5 1.5" />
          <path d="M40,25 v-10 c0,-1 1,-2 2,-2 h16 c1,0 2,1 2,2 v10 M25,75 v10 c0,1 1,2 2,2 h11 c1,0 2,-1 2,-2 v-10" stroke="#4F46E5" />
          <path d="M25,25 v-5 h15 M60,25 v-5 h15 M40,75 v5 h20 M60,75 v5 h15" stroke="#4F46E5" />
          <path d="M25,25 h-5 v50 h5 M75,25 h5 v50 h-5" stroke="#4F46E5" />
        </g>
      )}
      {type === 'auto_lock' && (
        <g strokeWidth="0.8" fill="none">
          <path d="M25,25 h50 M25,65 h50 M40,20 v60 M60,20 v60 M75,25 v50 M25,25 v50" stroke="#EF4444" strokeDasharray="1.5 1.5" />
          <path d="M40,25 v-10 c0,-1 1,-2 2,-2 h16 c1,0 2,1 2,2 v10" stroke="#4F46E5" />
          <path d="M25,25 v-5 h15 M60,25 v-5 h15 M75,25 h5 v40 h-5 M25,25 h-5 v40 h5" stroke="#4F46E5" />
          <path d="M25,65 l7,15 h8 v-15 M40,65 v15 h20 v-15 M60,65 l7,15 h8 v-15" stroke="#4F46E5" />
        </g>
      )}
      {type === 'cake' && (
        <g strokeWidth="0.8" fill="none">
          <path d="M20,35 h60 M20,75 h60 M35,20 v55 M55,20 v55 M75,35 v40 M20,35 v40" stroke="#EF4444" strokeDasharray="1.5 1.5" />
          <path d="M35,35 L45,15 h10 L65,35" stroke="#4F46E5" />
          <path d="M45,20 h10" stroke="#4F46E5" />
          <rect x="40" y="45" width="20" height="15" rx="3" stroke="#059669" strokeDasharray="2 2" />
          <path d="M20,35 h-5 v40 h5 M75,35 h5 v40 h-5" stroke="#4F46E5" />
        </g>
      )}
    </svg>
  );
};

export const Dieline3DSVG = ({ type }: { type: SVGType }) => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-h-[145px] drop-shadow-md transition-transform duration-300 group-hover/detail:-translate-y-1 group-hover/detail:scale-[1.03]">
      <ellipse cx="60" cy="88" rx="20" ry="4" fill="rgba(0,0,0,0.12)" />
      {type === 'cake' ? (
        <>
          <path d="M35,35 L65,30 L65,18 L35,22 Z" fill="#D97706" />
          <path d="M35,22 L50,10 L65,18 Z" fill="#F59E0B" />
          <path d="M25,37 L60,31 L60,83 L25,87 Z" fill="#FFFFFF" />
          <rect x="35" y="48" width="16" height="20" rx="3" fill="#38BDF8" opacity="0.5" stroke="#0284C7" strokeWidth="0.8" />
          <path d="M60,31 L75,27 L75,79 L60,83 Z" fill="#E2E8F0" />
        </>
      ) : (
        <>
          <path d="M35,35 L65,30 L65,18 L35,22 Z" fill="#B78F66" />
          <path d="M35,35 L65,30 L65,33 L35,38 Z" fill="#A07952" />
          <path d="M25,37 L35,35 L35,25 L28,26 Z" fill="#A07952" />
          <path d="M25,37 L60,31 L60,83 L25,87 Z" fill="#FFFFFF" />
          <path d="M60,31 L75,27 L75,79 L60,83 Z" fill="#E2E8F0" />
          <path d="M35,22 L65,18 L65,15 L35,20 Z" fill="#F8FAFC" />
        </>
      )}
    </svg>
  );
};
