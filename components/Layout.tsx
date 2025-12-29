import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, backgroundImage }) => {
  // Default background (Dashboard) vs Custom background (Auth)
  const bgImage = backgroundImage || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop";
  
  // If it's the auth background (custom), we want a heavier overlay.
  // If it's the dashboard (default), we keep the lighter overlay.
  const isCustomBg = !!backgroundImage;

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-900 text-white font-sans selection:bg-blue-500/30">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ${isCustomBg ? 'opacity-50' : 'opacity-30'}`}
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      
      {/* Overlay - Heavier for Auth screens to make text pop */}
      <div className={`absolute inset-0 z-10 bg-gradient-to-b ${isCustomBg ? 'from-black/60 via-black/40 to-black/90' : 'from-[#0f172a]/90 via-[#0f172a]/80 to-[#0f172a]'}`} />

      {/* Content */}
      <div className="relative z-20 flex flex-col h-screen max-w-md mx-auto shadow-2xl">
        {children}
      </div>
    </div>
  );
};