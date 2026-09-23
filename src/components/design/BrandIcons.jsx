import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, ArrowRight } from 'lucide-react';

// Design 1c: Coral + Sky Avatars holding Location Pin with Drop Shadows
export function MeetraLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="64" cy="46" rx="16" ry="16" fill="#1C2E52" />
      <path d="M48 64C36 78 30 102 36 122C42 128 58 126 62 108C65 95 67 80 73 70C65 64 54 62 48 64Z" fill="#1C2E52" />
      <ellipse cx="98" cy="46" rx="16" ry="16" fill="#1C2E52" />
      <path d="M114 64C126 78 132 102 126 122C120 128 104 126 100 108C97 95 95 80 89 70C97 64 108 62 114 64Z" fill="#1C2E52" />
      
      {/* Coral Left Peer */}
      <circle cx="56" cy="40" r="14" fill="#E8615A" stroke="#1C2E52" strokeWidth="4" />
      <path d="M44 58C34 70 30 92 34 114C38 120 50 118 54 104C57 91 61 76 68 64C60 58 49 56 44 58Z" fill="#E8615A" stroke="#1C2E52" strokeWidth="4" strokeLinejoin="round" />

      {/* Sky Blue Right Peer */}
      <circle cx="106" cy="40" r="14" fill="#88C7F2" stroke="#1C2E52" strokeWidth="4" />
      <path d="M118 58C128 70 132 92 128 114C124 120 112 118 108 104C105 91 101 76 94 64C102 58 113 56 118 58Z" fill="#88C7F2" stroke="#1C2E52" strokeWidth="4" strokeLinejoin="round" />

      {/* Central Connector & Pin */}
      <path d="M68 68L81 85L94 68C86 64 76 64 68 68Z" fill="#1C2E52" />
      <path d="M81 74C72 74 65 81 65 90C65 102 81 118 81 118C81 118 97 102 97 90C97 81 90 74 81 74Z" fill="#FBD46D" stroke="#1C2E52" strokeWidth="4" />
      <circle cx="81" cy="88" r="4.5" fill="#1C2E52" />
    </svg>
  );
}

// Scalloped Match Badge
export function ScallopedBadge({ children, className = "w-11 h-11" }) {
  return (
    <div className={`relative flex items-center justify-center text-white font-black text-xs ${className}`}>
      <svg className="absolute inset-0 w-full h-full text-[#22427D]" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0 C54 7 60 7 66 3 C72 8 77 10 81 18 C87 21 91 25 92 33 C97 38 98 44 96 52 C98 60 97 66 92 71 C91 79 87 83 81 86 C77 94 72 96 66 101 C60 97 54 97 50 100 C46 97 40 97 34 101 C28 96 23 94 19 86 C13 83 9 79 8 71 C3 66 2 60 4 52 C2 44 3 38 8 33 C9 25 13 21 19 18 C23 10 28 8 34 3 C40 7 46 7 50 0 Z" />
      </svg>
      <span className="relative z-10 text-[10px] leading-tight text-center font-extrabold">{children}</span>
    </div>
  );
}

// Interactive 3-step carousel modal
export function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F7FC]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-[0_16px_40px_rgba(34,66,125,0.12)] border border-slate-100 flex flex-col justify-between min-h-[580px] relative overflow-hidden">
        
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-bold text-slate-400">Step {step} of 3</span>
          <button onClick={onComplete} className="text-xs font-bold text-slate-400 hover:text-[#22427D]">
            Skip
          </button>
        </div>

        {/* Step 1: Trip Inputs */}
        {step === 1 && (
          <div className="space-y-6 relative z-10 my-auto text-left">
            <div className="bg-[#EEF4FD] rounded-[28px] p-5 space-y-2.5">
              <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#22427D] rounded-xl"><MapPin className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400">Destination</p>
                  <p className="text-xs font-black text-slate-800">Lisbon, Portugal</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Calendar className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400">Dates</p>
                  <p className="text-xs font-black text-slate-800">12 – 19 Oct</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-[#E8615A] rounded-xl"><DollarSign className="w-4 h-4" /></div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400">Budget</p>
                  <p className="text-xs font-black text-slate-800">$1,400</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enter your trip</h2>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Dates, budget and the places you have in mind. Rough plans are fine — edit any time.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Venn Overlap */}
        {step === 2 && (
          <div className="space-y-6 relative z-10 my-auto text-left">
            <div className="bg-[#EEF4FD] rounded-[28px] p-6 flex items-center justify-center min-h-[200px]">
              <div className="relative flex items-center justify-center w-full">
                <div className="w-28 h-28 rounded-full bg-[#BBD6F7]/60 flex items-center justify-start pl-3 font-bold text-xs text-[#22427D]">You</div>
                <div className="w-28 h-28 rounded-full bg-[#CBE8FC]/70 -ml-10 flex items-center justify-end pr-3 font-bold text-xs text-[#22427D]">Maya</div>
                <div className="absolute z-20">
                  <ScallopedBadge className="w-14 h-14">
                    <span className="block text-xs font-black">62%</span>
                    <span className="text-[7px] uppercase font-bold">overlap</span>
                  </ScallopedBadge>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">We match the overlap</h2>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                MeetRa compares dates, hubs and budgets. When plans overlap 60%+, you get matched.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Fare Split Card */}
        {step === 3 && (
          <div className="space-y-6 relative z-10 my-auto text-left">
            <div className="bg-[#EEF4FD] rounded-[28px] p-5 space-y-3">
              <div className="flex justify-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#CBE8FC] flex items-center justify-center font-black text-xs text-[#22427D]">A</div>
                <div className="w-10 h-10 rounded-2xl bg-[#FCD8CF] flex items-center justify-center font-black text-xs text-[#E8615A]">M</div>
                <div className="w-10 h-10 rounded-2xl bg-[#E0EDFB] flex items-center justify-center font-black text-xs text-[#22427D]">J</div>
              </div>

              <div className="bg-white rounded-2xl p-3.5 shadow-sm space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-600">
                  <span>Hostel, 3 nights</span>
                  <span className="text-slate-900 font-black">$264</span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>Sintra day trip</span>
                  <span className="text-slate-900 font-black">$96</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[#22427D] font-black">
                  <span>Split 3 ways</span>
                  <span>$120 each</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Travel together, split costs</h2>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                Coordinate rooms, rides, and transit splits directly within your chat thread.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 relative z-10">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((dot) => (
              <span key={dot} className={`h-2 rounded-full transition-all ${step === dot ? 'w-6 bg-[#22427D]' : 'w-2 bg-slate-200'}`} />
            ))}
          </div>

          <button
            onClick={() => step < 3 ? setStep(step + 1) : onComplete()}
            className="px-6 py-2.5 bg-[#22427D] hover:bg-[#1A3360] text-white text-xs font-black rounded-full flex items-center gap-2 shadow-md transition active:scale-95"
          >
            <span>{step < 3 ? 'Next' : 'Get started'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}