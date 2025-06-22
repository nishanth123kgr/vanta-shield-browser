import React from 'react';

const AnimatedBackground = () => {
  return (
    <>
      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            25% {
              transform: translate(20px, -30px) scale(1.05);
            }
            50% {
              transform: translate(-15px, 20px) scale(0.95);
            }
            75% {
              transform: translate(25px, 10px) scale(1.02);
            }
          }
        `
      }} />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient background - deep space feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
        
        {/* Large animated gradient orbs with slow movement */}
        <div className="absolute inset-0">
          {/* Dominant purple/blue orb - top area */}
          <div 
            className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(79, 70, 229, 0.3) 30%, rgba(59, 130, 246, 0.2) 60%, transparent 100%)',
              left: '10%',
              top: '-20%',
              animation: 'float 20s ease-in-out infinite',
            }}
          />
          
          {/* Blue/purple orb - bottom right */}
          <div 
            className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-25"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.3) 40%, rgba(168, 85, 247, 0.2) 70%, transparent 100%)',
              right: '-10%',
              bottom: '-15%',
              animation: 'float 25s ease-in-out infinite reverse',
            }}
          />
          
          {/* Medium cyan orb - left side */}
          <div 
            className="absolute w-[500px] h-[500px] rounded-full blur-2xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(14, 165, 233, 0.3) 50%, transparent 100%)',
              left: '-15%',
              top: '40%',
              animation: 'float 18s ease-in-out infinite',
              animationDelay: '5s'
            }}
          />
          
          {/* Smaller accent orbs */}
          <div 
            className="absolute w-[300px] h-[300px] rounded-full blur-xl opacity-15"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(139, 92, 246, 0.3) 60%, transparent 100%)',
              right: '20%',
              top: '15%',
              animation: 'float 15s ease-in-out infinite',
              animationDelay: '2s'
            }}
          />
          
          <div 
            className="absolute w-[250px] h-[250px] rounded-full blur-xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.3) 60%, transparent 100%)',
              left: '60%',
              bottom: '20%',
              animation: 'float 22s ease-in-out infinite reverse',
              animationDelay: '8s'
            }}
          />
        </div>
        
        {/* Mesh overlay for depth and texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
    </>
  );
};

export default AnimatedBackground;