
import React, { useState } from 'react';
import { PracticalEduLogo } from './VectorLogo';
import { Phone } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, nationalId: string, phoneNumber: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameParts = username.trim().split(/\s+/);
    if (nameParts.length < 4) {
      alert("يرجى إدخل الاسم رباعياً لضمان دقة البيانات");
      return;
    }

    if (nationalId.length !== 14 || isNaN(Number(nationalId))) {
      alert("خطأ: يجب أن يتكون الرقم القومي من 14 رقماً صحيحاً");
      return;
    }

    if (phoneNumber.length !== 11 || isNaN(Number(phoneNumber))) {
      alert("خطأ: يجب أن يتكون رقم الهاتف من 11 رقماً");
      return;
    }

    onLogin(username, nationalId, phoneNumber);
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
          
          <div className="bg-gradient-to-br from-sky-700 to-sky-900 p-8 text-center text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
            <div className="relative z-10">
              <div className="relative mx-auto w-32 h-32 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-sky-400 rounded-full animate-pulse opacity-20 blur-xl"></div>
                <div className="relative w-full h-full rounded-full bg-white shadow-2xl border-4 border-sky-400/30 flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-500">
                  <PracticalEduLogo size={100} />
                </div>
              </div>
              
              <h1 className="text-xl font-black tracking-tight mb-1">البوابة الالكترونية الذكية للتربية العملية</h1>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="h-px w-8 bg-orange-400/50"></span>
                <p className="text-sky-100 text-[9px] font-black uppercase tracking-[0.3em]">وحدة التربية العملية</p>
                <span className="h-px w-8 bg-orange-400/50"></span>
              </div>
              <p className="text-orange-200/90 text-[10px] font-bold">كلية التربية بتفهنا الأشراف</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white">
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
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-center tracking-[0.2em] font-mono text-lg text-sky-900 font-black placeholder:text-slate-300"
                placeholder="00000000000000"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 mr-2 text-right uppercase tracking-widest">رقم الهاتف (11 رقم)</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" 
                  value={phoneNumber}
                  maxLength={11}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-6 pr-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-center tracking-[0.1em] font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="01xxxxxxxxx"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-800 text-white font-black py-4 rounded-2xl transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-sky-100 flex items-center justify-center gap-3 text-base relative group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span>الدخول للبوابة الإلكترونية</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            
            <div className="pt-2 text-center">
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
