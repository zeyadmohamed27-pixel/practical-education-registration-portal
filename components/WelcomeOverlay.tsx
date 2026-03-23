
import React from 'react';
import { GraduationCap, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { AzharLogo } from './VectorLogo';

interface WelcomeOverlayProps {
  username: string;
  onDismiss: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ username, onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-500">
      <div className="max-w-4xl w-full p-8 text-center flex flex-col items-center">
        {/* Academic Student Illustration */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <div className="absolute inset-0 bg-amber-400/10 blur-2xl rounded-full scale-110"></div>
          <div className="relative z-10 flex items-center justify-center">
            <AzharLogo size={240} className="shadow-2xl border-emerald-600/20" />
            <div className="absolute -top-6 -right-6 animate-bounce delay-100">
              <Sparkles className="text-amber-400 w-14 h-14 drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-6 -left-6 animate-bounce delay-300">
              <BookOpen className="text-emerald-600 w-12 h-12 drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="space-y-4 animate-in slide-in-from-bottom-10 duration-700 delay-200">
          <h2 className="text-4xl sm:text-6xl font-black text-slate-800 leading-tight">
            أهلاً بك يا <span className="text-emerald-700"> معلم المستقبل</span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
             معلم المستقبل <span className="font-bold text-slate-800 underline decoration-emerald-500 underline-offset-8">{username}</span>، يسعدنا انضمامك لبوابة التربية العملية. رحلة غرس العلم تبدأ بخطوة واثقة.
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
