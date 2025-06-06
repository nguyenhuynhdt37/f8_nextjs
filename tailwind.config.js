/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 15s ease-in-out infinite',
        'slide-slow': 'slide 25s linear infinite',
        'progress-35': 'progress-35 2.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
        text: 'text 8s ease infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        count: 'count 2s ease-out forwards',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'progress-35': {
          '0%': { width: '0%' },
          '100%': { width: '35%' },
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        count: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'shooting-star': {
          '0%': {
            transform: 'rotate(215deg) translateX(0)',
            opacity: 1,
          },
          '70%': {
            opacity: 1,
          },
          '100%': {
            transform: 'rotate(215deg) translateX(500px)',
            opacity: 0,
          },
        },
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      perspective: {
        1000: '1000px',
      },
      rotate: {
        'x-30': 'rotateX(30deg)',
        'x-45': 'rotateX(45deg)',
        'x-90': 'rotateX(90deg)',
        'y-45': 'rotateY(45deg)',
        'y-90': 'rotateY(90deg)',
        'y-120': 'rotateY(120deg)',
        'y-240': 'rotateY(240deg)',
      },
      translate: {
        'z-6': 'translateZ(6px)',
        '-z-6': 'translateZ(-6px)',
      },
      borderWidth: {
        16: '16px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
