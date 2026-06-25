/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-40px, 30px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.08)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmerText: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        crownPulse: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 4px rgba(250,204,21,0.4))' },
          '50%': { transform: 'scale(1.15)', filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.8))' },
        },
        badgePulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 12px rgba(249,115,22,0.3)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 20px rgba(249,115,22,0.5)' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 12s ease-in-out infinite',
        'float-slow': 'floatSlow 18s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease infinite',
        'shimmer-text': 'shimmerText 4s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'crown-pulse': 'crownPulse 2s ease-in-out infinite',
        'badge-pulse': 'badgePulse 2s ease-in-out infinite',
        'skeleton-pulse': 'skeletonPulse 1.8s ease-in-out infinite',
        'page-enter': 'pageEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      boxShadow: {
        glow: '0 0 30px rgba(34, 197, 94, 0.15)',
        'glow-lg': '0 0 50px rgba(34, 197, 94, 0.25)',
        'glow-xl': '0 0 80px rgba(34, 197, 94, 0.2)',
        'glow-purple': '0 0 40px rgba(168, 85, 247, 0.2)',
        'glow-purple-sm': '0 0 20px rgba(168, 85, 247, 0.15)',
        card: '0 8px 32px rgba(0, 0, 0, 0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}
