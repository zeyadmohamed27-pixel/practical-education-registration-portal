
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/** 
 * الشعار الرسمي المعتمد لجامعة الأزهر
 * تم استخدام رابط مباشر لضمان استقرار الصورة ووضوحها
 */
const LOGO_URL = "https://afteegypt.org/wp-content/uploads/2012/03/al-azhar-university-logo-edufina.jpg";

export const AzharLogo: React.FC<LogoProps> = ({ size = 64, className = "" }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white border-4 border-emerald-700/20 shadow-[0_0_20px_rgba(5,150,105,0.2)] transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] duration-500`}
    style={{ width: size, height: size }}
  >
    <div className="w-full h-full p-1.5 bg-gradient-to-br from-white to-emerald-50/30 rounded-full flex items-center justify-center">
      <img 
        src={LOGO_URL} 
        alt="شعار جامعة الأزهر" 
        className="w-[92%] h-[92%] object-contain drop-shadow-md"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://afteegypt.org/wp-content/uploads/2012/03/al-azhar-university-logo-edufina.jpg";
        }}
      />
    </div>
  </div>
);

// Alias for compatibility
export const PracticalEduLogo = AzharLogo;
