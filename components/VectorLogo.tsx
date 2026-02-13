
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/** 
 * الشعار الرسمي المعتمد لجامعة الأزهر
 * تم استخدام رابط مباشر لضمان استقرار الصورة ووضوحها
 */
const LOGO_URL = "https://upload.wikimedia.org/wikipedia/ar/thumb/0/00/Al-Azhar_University_logo.png/600px-Al-Azhar_University_logo.png";

export const AzharLogo: React.FC<LogoProps> = ({ size = 64, className = "" }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white border-2 border-amber-400 shadow-md transition-transform hover:scale-105 duration-300`}
    style={{ width: size, height: size }}
  >
    <img 
      src={LOGO_URL} 
      alt="شعار جامعة الأزهر" 
      className="w-[85%] h-[85%] object-contain p-1"
      onError={(e) => {
        (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/initials/svg?seed=AZ";
      }}
    />
  </div>
);

export const PracticalEduLogo: React.FC<LogoProps> = ({ size = 120, className = "" }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white shadow-xl border-4 border-emerald-800/20`}
    style={{ width: size, height: size }}
  >
    <img 
      src={LOGO_URL} 
      alt="الختم الرسمي لجامعة الأزهر" 
      className="w-full h-full object-contain p-2"
    />
  </div>
);
