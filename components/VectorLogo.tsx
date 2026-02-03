
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/** 
 * الشعار الرسمي المعتمد لجامعة الأزهر
 */
const AZHAR_OFFICIAL_LOGO = "https://upload.wikimedia.org/wikipedia/ar/7/7f/Al-Azhar_University_logo.png";

export const AzharLogo: React.FC<LogoProps> = ({ size = 64, className = "" }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white border-2 border-amber-400 shadow-md`}
    style={{ width: size, height: size }}
  >
    <img 
      src={AZHAR_OFFICIAL_LOGO} 
      alt="Al-Azhar Seal" 
      className="w-[90%] h-[90%] object-contain"
      loading="eager"
    />
  </div>
);

export const PracticalEduLogo: React.FC<LogoProps> = ({ size = 120, className = "" }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white shadow-sm`}
    style={{ width: size, height: size }}
  >
    <img 
      src={AZHAR_OFFICIAL_LOGO} 
      alt="Al-Azhar University" 
      className="w-full h-full object-contain p-1"
      loading="eager"
    />
  </div>
);
