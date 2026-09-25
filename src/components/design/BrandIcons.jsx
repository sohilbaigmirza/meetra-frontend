import React from 'react';

// Official MeetRa Logo 1c (Dual peers holding yellow location pin with drop shadow)
export function MeetraLogo({ className = "w-20 h-20" }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="64" cy="46" rx="16" ry="16" fill="#1C2E52" />
      <path d="M48 64C36 78 30 102 36 122C42 128 58 126 62 108C65 95 67 80 73 70C65 64 54 62 48 64Z" fill="#1C2E52" />
      <ellipse cx="98" cy="46" rx="16" ry="16" fill="#1C2E52" />
      <path d="M114 64C126 78 132 102 126 122C120 128 104 126 100 108C97 95 95 80 89 70C97 64 108 62 114 64Z" fill="#1C2E52" />
      
      {/* Coral Peer */}
      <circle cx="56" cy="40" r="14" fill="#E8615A" stroke="#1C2E52" strokeWidth="4" />
      <path d="M44 58C34 70 30 92 34 114C38 120 50 118 54 104C57 91 61 76 68 64C60 58 49 56 44 58Z" fill="#E8615A" stroke="#1C2E52" strokeWidth="4" strokeLinejoin="round" />

      {/* Sky Blue Peer */}
      <circle cx="106" cy="40" r="14" fill="#88C7F2" stroke="#1C2E52" strokeWidth="4" />
      <path d="M118 58C128 70 132 92 128 114C124 120 112 118 108 104C105 91 101 76 94 64C102 58 113 56 118 58Z" fill="#88C7F2" stroke="#1C2E52" strokeWidth="4" strokeLinejoin="round" />

      {/* Connector and Location Pin */}
      <path d="M68 68L81 85L94 68C86 64 76 64 68 68Z" fill="#1C2E52" />
      <path d="M81 74C72 74 65 81 65 90C65 102 81 118 81 118C81 118 97 102 97 90C97 81 90 74 81 74Z" fill="#FBD46D" stroke="#1C2E52" strokeWidth="4" />
      <circle cx="81" cy="88" r="4.5" fill="#1C2E52" />
    </svg>
  );
}

// 12-point Scalloped Match Badge
export function ScallopedBadge({ children, className = "w-10 h-10" }) {
  return (
    <div className={`relative flex items-center justify-center text-white font-black text-xs ${className}`}>
      <svg className="absolute inset-0 w-full h-full text-[#22427D]" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0 C54 7 60 7 66 3 C72 8 77 10 81 18 C87 21 91 25 92 33 C97 38 98 44 96 52 C98 60 97 66 92 71 C91 79 87 83 81 86 C77 94 72 96 66 101 C60 97 54 97 50 100 C46 97 40 97 34 101 C28 96 23 94 19 86 C13 83 9 79 8 71 C3 66 2 60 4 52 C2 44 3 38 8 33 C9 25 13 21 19 18 C23 10 28 8 34 3 C40 7 46 7 50 0 Z" />
      </svg>
      <span className="relative z-10 text-[10px] leading-tight text-center font-extrabold">{children}</span>
    </div>
  );
}