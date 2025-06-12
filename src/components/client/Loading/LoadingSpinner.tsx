'use client';
import React, { useEffect, useState } from 'react';


const tips = [
  "Học tập từng bước nhỏ sẽ tạo ra thành công lớn",
  "Lập trình viên giỏi không phải là người không gặp bug",
  "Thất bại là cách bạn học code tốt hơn",
  "Code sạch giúp dự án của bạn bền vững",
  "Kiên nhẫn là kỹ năng quan trọng nhất của lập trình viên",
  "Đầu tư thời gian cho việc đọc mã nguồn mở",
  "Rèn luyện kỹ năng debug sẽ giúp bạn tiết kiệm thời gian",
];

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + Math.random() * 10;
        return nextProgress > 95 ? 95 : nextProgress;
      });
    }, 400);

    // Tip rotation
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(tipInterval);
    };
  }, []);

  // Simulate faster loading completion after some time
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 perspective">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-90">
        {/* Animated particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--index': i,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--size': `${Math.random() * 10 + 5}px`,
                '--delay': `${Math.random() * 5}s`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      <div className={`transform transition-all duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div className="relative flex flex-col items-center max-w-md px-10 py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl backdrop-blur-lg bg-opacity-90 dark:bg-opacity-80">
          {/* Animated code lines */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10">
            <div className="code-lines" />
          </div>

          {/* Glowing ring */}
          <div className="relative h-40 w-40 mb-8">
            {/* Multiple rotating rings */}
            <div className="absolute inset-0 ring-1 rounded-full ring-offset-1 animate-spin-slower" />
            <div className="absolute inset-0 ring-2 rounded-full ring-blue-500 ring-offset-1 animate-spin-slow opacity-30" />
            <div className="absolute inset-0 ring-2 rounded-full ring-orange-500 ring-offset-2 animate-spin-reverse opacity-20" />

            {/* Glowing circles */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute glow-dot"
                style={{
                  '--index': i,
                  '--angle': `${i * 90}deg`,
                } as React.CSSProperties}
              />
            ))}

            {/* Main logo container */}
            <div className="absolute inset-5 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-inner pulse-animation">
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
                {/* Logo with glow effect */}
                <div className="absolute inset-0 logo-glow" />
                <img
                  src="/logo/logo1.png"
                  alt="F8 Logo"
                  width={85}
                  height={85}
                  className="z-10 drop-shadow-xl hover-float dark:brightness-110"
                />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text mb-3 animate-shimmer">
            Đang tải dữ liệu...
          </h2>

          {/* Progress bar with animated glow */}
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-5 overflow-hidden relative">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-full glow-bar transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute h-full w-20 bg-white/20 animate-shimmer-bar rounded-full" />
          </div>

          {/* Animated tip messages */}
          <div className="h-16 text-center overflow-hidden relative">
            <div className="w-full transition-transform duration-500 ease-out px-4" style={{
              transform: `translateY(-${tipIndex * 100}%)`,
            }}>
              {tips.map((tip, i) => (
                <p key={i} className="h-16 flex items-center justify-center text-gray-600 dark:text-gray-300 italic">
                  {tip}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center text-xs text-gray-500 dark:text-gray-400 font-code">
            <span className="animate-blink mr-2">▶</span>
            <span className="typing-animation">console.log("Hello F8 Developer");</span>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slower {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes move-particle {
          0% { transform: translate(0, 0); opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 0.5; }
          100% { transform: translate(var(--move-x, 50px), var(--move-y, 50px)); opacity: 0; }
        }
        
        @keyframes code-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        :global(.animate-spin-slow) {
          animation: spin-slow 4s linear infinite;
        }
        
        :global(.animate-spin-slower) {
          animation: spin-slower 7s linear infinite;
        }
        
        :global(.animate-spin-reverse) {
          animation: spin-reverse 5s linear infinite;
        }
        
        :global(.animate-shimmer) {
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
        
        :global(.animate-shimmer-bar) {
          animation: shimmer 1.5s linear infinite;
        }
        
        :global(.hover-float) {
          animation: float 3s ease-in-out infinite;
        }
        
        :global(.animate-blink) {
          animation: blink 1s step-end infinite;
        }
        
        :global(.typing-animation) {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid;
          width: 0;
          animation: typing 3s steps(30, end) forwards;
        }
        
        :global(.pulse-animation) {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .font-code {
          font-family: monospace;
        }
        
        .glow-dot {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: rgb(59, 130, 246);
          filter: blur(1px);
          transform-origin: center 100px;
          transform: rotate(var(--angle)) translateY(-100px);
          animation: spin-slow 4s linear infinite;
          opacity: 0.7;
          box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.4);
        }
        
        .logo-glow {
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
        }
        
        .glow-bar {
          box-shadow: 0 0 15px 3px rgba(59, 130, 246, 0.5);
        }
        
        .particles .particle {
          position: absolute;
          width: var(--size, 8px);
          height: var(--size, 8px);
          background-color: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          left: var(--x, 50%);
          top: var(--y, 50%);
          --move-x: calc(var(--index) * 30px - 150px);
          --move-y: calc(var(--index) * 20px - 100px);
          animation: move-particle 10s linear infinite;
          animation-delay: var(--delay, 0s);
        }
        
        .code-lines {
          height: 200%;
          width: 100%;
          background-image:
            linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .05) 25%, rgba(59, 130, 246, .05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .05) 75%, rgba(59, 130, 246, .05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, .05) 25%, rgba(59, 130, 246, .05) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .05) 75%, rgba(59, 130, 246, .05) 76%, transparent 77%, transparent);
          background-size: 50px 50px;
          animation: code-scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
