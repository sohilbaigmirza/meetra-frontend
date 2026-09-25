// MeetRa Designer Theme Tokens & Utility Classes (from Mockups 2 to 10)
export const THEME = {
  colors: {
    primary: '#22427D',        // Cobalt Blue
    primaryHover: '#1A3360',
    primaryLight: '#EEF4FD',   // Ice Blue Card Background
    secondary: '#E8615A',      // Terracotta Coral
    secondaryLight: '#FDEEE9', // Soft Peach
    background: '#F6F9FD',     // Clean canvas
    cardWhite: '#FFFFFF',
    textDark: '#0F172A',
    textMuted: '#64748B',
    accentYellow: '#FBD46D'
  },
  
  classes: {
    // App screen container
    screenContainer: "min-h-screen bg-[#F6F9FD] text-[#0F172A] flex flex-col justify-between max-w-md mx-auto relative overflow-x-hidden shadow-2xl",
    
    // Large rounded card for main sections (e.g. Plan an Outing)
    heroCard: "bg-[#EEF4FD] rounded-[32px] p-5 shadow-[0_8px_24px_rgba(34,66,125,0.06)] border border-blue-50/70 space-y-4 text-left",
    
    // Clean elevated white card
    whiteCard: "bg-white rounded-[26px] p-4 shadow-[0_6px_20px_rgba(34,66,125,0.05)] border border-slate-100/80",
    
    // Floating nested pill for inputs
    pillInput: "bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between",
    
    // Primary cobalt rounded button
    btnPrimary: "w-full py-3.5 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-[0_6px_16px_rgba(34,66,125,0.2)] transition active:scale-[0.98] flex items-center justify-center gap-2",
    
    // Secondary pill button
    btnSecondary: "px-3.5 py-1.5 bg-[#EEF4FD] hover:bg-blue-100 text-[#22427D] font-bold text-xs rounded-full transition active:scale-95"
  }
};