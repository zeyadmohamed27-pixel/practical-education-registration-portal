
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

// استخدام رابط افتراضي لصورة الشعار - يمكن للمستخدم استبداله بالمسار المحلي azhar-logo.png
const AZHAR_LOGO_URL = "https://i.ibb.co/v4m8NfR/azhar-logo.png"; 

export const PracticalEduLogo: React.FC<LogoProps> = ({ className = "", size = 100 }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white shadow-inner`}
    style={{ width: size, height: size }}
  >
    <img 
      src={AZHAR_LOGO_URL} 
      alt="Al-Azhar University Logo" 
      className="w-full h-full object-contain p-1"
      onError={(e) => {
        // fallback في حال فشل تحميل الصورة
        e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/ar/7/7f/Al-Azhar_University_logo.png";
      }}
    />
  </div>
);

export const AzharLogo: React.FC<LogoProps> = ({ className = "", size = 64 }) => (
  <div 
    className={`${className} flex items-center justify-center overflow-hidden rounded-full bg-white border border-slate-100 shadow-sm`}
    style={{ width: size, height: size }}
  >
    <img 
      src={AZHAR_LOGO_URL} 
      alt="Azhar Seal" 
      className="w-[90%] h-[90%] object-contain"
    />
  </div>
);
