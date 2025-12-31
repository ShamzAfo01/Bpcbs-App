
import React from 'react';

const RainEffect: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-blue-200 w-px h-8 animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
            animationDelay: `${Math.random() * 2}s`,
            animationIterationCount: 'infinite'
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(100vh); }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
};

export default RainEffect;
