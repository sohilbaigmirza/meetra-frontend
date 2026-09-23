// Design Tokens & Shared Classnames matching the Figma Travel Identity
export const THEME = {
  colors: {
    primary: '#22427D',       // Cobalt brand primary
    primaryHover: '#1A3360',
    primaryLight: '#EEF4FD',  // Soft pill background
    secondary: '#E8615A',     // Coral accent
    secondaryLight: '#FDEEE9',
    background: '#F8FAFC',    // Off-white canvas
    card: '#FFFFFF',
    textMain: '#0F172A',
    textMuted: '#64748B',
    accentYellow: '#FBD46D',
  },
  
  // Reusable Tailwind Class Combinations
  cards: {
    softPill: "bg-[#EEF4FD] rounded-[28px] p-5 shadow-[0_8px_24px_rgba(34,66,125,0.06)] border border-blue-50/60",
    whiteSurface: "bg-white rounded-[24px] p-4 shadow-[0_8px_20px_rgba(34,66,125,0.05)] border border-slate-100",
    innerInputPill: "bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between",
  },
  
  buttons: {
    primaryRounded: "w-full py-3.5 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2",
    secondaryPill: "px-4 py-2 bg-[#EEF4FD] hover:bg-blue-100 text-[#22427D] font-bold text-xs rounded-full transition active:scale-95",
  }
};