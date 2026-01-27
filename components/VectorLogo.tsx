
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const PracticalEduLogo: React.FC<LogoProps> = ({ className = "", size = 100 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={`${className} overflow-visible`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
      <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#064e3b" />
      </linearGradient>
    </defs>
    
    {/* Animated Islamic Star (Rotating Frame) */}
    <path 
      className="animate-[spin_20s_linear_infinite]"
      style={{ transformOrigin: 'center' }}
      d="M100 5 L125 45 L170 45 L145 85 L185 115 L140 125 L140 170 L100 145 L60 170 L60 125 L15 115 L55 85 L30 45 L75 45 Z" 
      stroke="url(#goldGradient)" 
      strokeWidth="2" 
      strokeDasharray="5 5"
    />
    
    {/* Solid Inner Frame */}
    <path 
      d="M100 20 L120 55 L160 65 L135 95 L145 135 L100 120 L55 135 L65 95 L40 65 L80 55 Z" 
      fill="url(#emeraldGradient)"
      className="animate-pulse"
    />

    {/* Book Icon */}
    <path 
      d="M70 80 C70 75 75 70 80 70 L120 70 C125 70 130 75 130 80 L130 110 C130 115 125 120 120 120 L80 120 C75 120 70 115 70 110 Z" 
      fill="white" 
    />
    <path d="M100 70 L100 120" stroke="#059669" strokeWidth="1" />
    
    {/* Graduation Cap atop the book */}
    <path 
      d="M85 75 L100 65 L115 75 L100 85 Z" 
      fill="#1e293b" 
    />
    <path d="M115 75 L118 85" stroke="#fbbf24" strokeWidth="1" />
  </svg>
);

export const AzharLogo: React.FC<LogoProps> = ({ className = "", size = 64 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="48" stroke="#059669" strokeWidth="1.5" strokeDasharray="4 2" />
    <circle cx="50" cy="50" r="42" fill="#059669" fillOpacity="0.05" />
    
    {/* Stylized Al-Azhar Calligraphy Representation */}
    <path 
      d="M35 70 C35 70 30 60 30 40 C30 20 45 15 50 15 C55 15 70 20 70 40 C70 60 65 70 65 70" 
      stroke="#059669" 
      strokeWidth="4" 
      strokeLinecap="round" 
    />
    <path 
      d="M40 50 L60 50 M50 35 L50 65" 
      stroke="#fbbf24" 
      strokeWidth="3" 
      strokeLinecap="round" 
    />
    <path 
      d="M45 75 Q50 85 55 75" 
      stroke="#059669" 
      strokeWidth="2" 
      fill="none" 
    />
  </svg>
);
