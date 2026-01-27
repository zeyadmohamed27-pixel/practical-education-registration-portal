
import React, { useState } from 'react';
import { PracticalEduLogo } from './VectorLogo';

interface LoginFormProps {
  onLogin: (username: string, nationalId: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [nationalId, setNationalId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameParts = username.trim().split(/\s+/);
    if (nameParts.length < 4) {
      alert("يرجى إدخال الاسم رباعياً لضمان دقة البيانات");
      return;
    }

    if (nationalId.length !== 14 || isNaN(Number(nationalId))) {
      alert("خطأ: يجب أن يتكون الرقم القومي من 14 رقماً صحيحاً");
      return;
    }

    onLogin(username, nationalId);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-sky-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 0 L73.4 41.4 L117 41.4 L81.8 67.1 L95.2 108.5 L60 82.8 L24.8 108.5 L38.2 67.1 L3 41.4 L46.6 41.4 Z" fill="none" stroke="#7dd3fc" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-md rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] overflow-hidden border border-sky-100/30">
          
          <div className="bg-gradient-to-br from-sky-700 to-sky-900 p-10 text-center text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
            <div className="relative z-10">
              <div className="relative mx-auto w-40 h-40 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-sky-400 rounded-full animate-pulse opacity-20 blur-xl"></div>
                <div className="relative w-full h-full rounded-full bg-white shadow-2xl border-4 border-sky-400/30 flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-500">
                  <PracticalEduLogo size={120} />
                </div>
              </div>
              
              <h1 className="text-2xl font-black tracking-tight mb-2">منظومة تسجيل الطلاب</h1>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="h-px w-8 bg-orange-400/50"></span>
                <p className="text-sky-100 text-[10px] font-black uppercase tracking-[0.3em]">وحدة التربية العملية</p>
                <span className="h-px w-8 bg-orange-400/50"></span>
              </div>
              <p className="text-orange-200/90 text-[11px] font-bold">كلية التربية بتفهنا الأشراف</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-7 bg-white">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 mr-2 text-right uppercase tracking-widest">الاسم رباعياً (كما في الكشف)</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-right text-slate-800 font-bold placeholder:text-slate-300"
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 mr-2 text-right uppercase tracking-widest">الرقم القومي (14 رقم)</label>
              <input 
                type="text" 
                value={nationalId}
                maxLength={14}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-center tracking-[0.3em] font-mono text-xl text-sky-900 font-black placeholder:text-slate-300"
                placeholder="00000000000000"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-800 text-white font-black py-5 rounded-2xl transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl shadow-sky-200 flex items-center justify-center gap-3 text-lg relative group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span>الدخول للبوابة الإلكترونية</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <div className="pt-4 border-t border-slate-50 text-center">
              <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">
                قسم المناهج وطرق التدريس <br/>
                جامعة الأزهر - كلية التربية بنين
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
