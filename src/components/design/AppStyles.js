// Design tokens and classmaps reflecting designer mockups (Screens 1 to 4)
export const THEME = {
  colors: {
    primary: '#22427D',
    primaryHover: '#1A3360',
    primaryLight: '#EEF4FD',
    secondary: '#E8615A',
    secondaryLight: '#FDEEE9',
    background: '#F6F9FD',
    white: '#FFFFFF',
    textDark: '#0F172A',
    textMuted: '#64748B',
    accentYellow: '#FBD46D'
  },
  classes: {
    // Canvas container
    screenContainer: "min-h-screen bg-[#F6F9FD] text-[#0F172A] flex flex-col justify-between max-w-md mx-auto relative overflow-x-hidden shadow-2xl",
    
    // Main featured card (e.g. Plan a Trip)
    heroCard: "bg-[#EEF4FD] rounded-[32px] p-5 shadow-[0_8px_24px_rgba(34,66,125,0.06)] border border-blue-50/70 space-y-4 text-left",
    
    // Standard white surface card
    whiteCard: "bg-white rounded-[26px] p-4 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100/80",
    
    // Nested white pill inside hero card
    pillInput: "bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between",
    
    // Primary cobalt action button
    btnPrimary: "w-full py-3.5 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-[0_6px_16px_rgba(34,66,125,0.2)] transition active:scale-[0.98] flex items-center justify-center gap-2",
    
    // Accent pill button
    btnSecondary: "px-3.5 py-1.5 bg-[#EEF4FD] hover:bg-blue-100 text-[#22427D] font-bold text-xs rounded-full transition active:scale-95",

    // Bottom floating navigation
    navBar: "fixed bottom-0 max-w-md w-full bg-white/95 backdrop-blur-md border-t border-slate-100 py-2.5 px-6 z-40 flex justify-between items-center shadow-[0_-8px_24px_rgba(34,66,125,0.05)]"
  }
};