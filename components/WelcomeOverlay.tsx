
import React from 'react';
import { GraduationCap, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

interface WelcomeOverlayProps {
  username: string;
  onDismiss: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ username, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="max-w-4xl w-full p-8 text-center flex flex-col items-center">
        {/* Academic Student Illustration */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full"></div>
          <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center transition-transform hover:scale-105 duration-500">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-in zoom-in-50 duration-700">
              {/* Background Glow */}
              <circle cx="100" cy="100" r="90" fill="#f0fdf4" />
              
              {/* Student Body */}
              <path d="M60,180 Q100,140 140,180 L140,200 L60,200 Z" fill="#065f46" />
              
              {/* Head & Neck */}
              <rect x="95" y="90" width="10" height="15" fill="#fde68a" />
              <circle cx="100" cy="75" r="28" fill="#fde68a" />
              
              {/* Graduation Cap (قبعة التخرج) */}
              <path d="M60,65 L100,45 L140,65 L100,85 Z" fill="#1e293b" />
              <rect x="95" y="65" width="10" height="10" fill="#1e293b" />
              <path d="M140,65 L145,95" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="145" cy="95" r="4" fill="#fbbf24" />
              
              {/* The Book (الكتاب) */}
              <g transform="rotate(-15 80 140)">
                <rect x="65" y="120" width="40" height="55" rx="3" fill="#047857" />
                <path d="M70,130 L100,130 M70,145 L100,145 M70,160 L100,160" stroke="#fff" strokeWidth="2" opacity="0.6" />
                <rect x="65" y="120" width="8" height="55" fill="#065f46" />
              </g>
              
              {/* Face Details */}
              <circle cx="90" cy="75" r="2.5" fill="#1e293b" />
              <circle cx="110" cy="75" r="2.5" fill="#1e293b" />
              <path d="M95,88 Q100,92 105,88" stroke="#1e293b" fill="none" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="absolute top-10 right-10 animate-pulse">
              <Sparkles className="text-amber-400 w-12 h-12" />
            </div>
            <div className="absolute bottom-5 left-5 animate-bounce">
              <BookOpen className="text-emerald-500 w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-700 delay-200">
          <h2 className="text-4xl sm:text-6xl font-black text-slate-800 leading-tight">
            أهلاً بك يا <span className="text-emerald-700">فخر الأزهر</span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            الزميل العزيز <span className="font-bold text-slate-800 underline decoration-emerald-500 underline-offset-8">{username}</span>، يسعدنا انضمامك لبوابة التربية العملية. رحلة غرس العلم تبدأ بخطوة واثقة.
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onDismiss}
          className="mt-12 group flex items-center gap-4 bg-emerald-700 hover:bg-emerald-800 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-emerald-200 transition-all hover:scale-105 active:scale-95 animate-in slide-in-from-bottom-20 duration-1000 delay-300"
        >
          <span>ابدأ رحلتي المهنية</span>
          <ArrowLeft className="w-8 h-8 group-hover:-translate-x-2 transition-transform" />
        </button>

        <div className="mt-16 text-slate-400 text-sm font-bold flex items-center gap-2 opacity-60">
          <GraduationCap size={22} />
          <span>كلية التربية بنين بتفهنا الأشراف - قسم المناهج وطرق التدريس</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
