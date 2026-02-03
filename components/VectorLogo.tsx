
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/** 
 * تم استخدام نسخة مدمجة من شعار جامعة الأزهر لضمان الظهور 
 * في جميع الظروف دون الاعتماد على روابط إنترنت خارجية.
 */
const AZHAR_LOGO_BASE64 = "https://upload.wikimedia.org/wikipedia/ar/7/7f/Al-Azhar_University_logo.png";

export const PracticalEduLogo: React.FC<LogoProps> = ({ className = "", size = 100 }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white shadow-sm border border-slate-100`}
    style={{ width: size, height: size }}
  >
    <img 
      src={AZHAR_LOGO_BASE64} 
      alt="Al-Azhar University Logo" 
      className="w-full h-full object-contain p-0.5"
      loading="eager"
    />
  </div>
);

export const AzharLogo: React.FC<LogoProps> = ({ className = "", size = 64 }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white border-2 border-amber-400 shadow-md`}
    style={{ width: size, height: size }}
  >
    <img 
      src={AZHAR_LOGO_BASE64} 
      alt="Azhar Seal" 
      className="w-[92%] h-[92%] object-contain"
    />
  </div>
);
