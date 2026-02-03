
import React, { useState } from 'react';
import { PracticalEduLogo } from './VectorLogo';
import { Phone, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#042f22]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 0 L73.4 41.4 L117 41.4 L81.8 67.1 L95.2 108.5 L60 82.8 L24.8 108.5 L38.2 67.1 L3 41.4 L46.6 41.4 Z" fill="none" stroke="#fbbf24" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white/95 backdrop-blur-md rounded-[3rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)] overflow-hidden border border-emerald-900/10">
          
          <div className="bg-gradient-to-br from-[#055039] to-[#032e21] p-10 text-center text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
            <div className="relative z-10">
              <div className="relative mx-auto w-36 h-36 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-amber-400 rounded-full animate-pulse opacity-10 blur-2xl"></div>
                <div className="relative w-full h-full rounded-full bg-white shadow-2xl border-4 border-amber-500/20 flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-500">
                  <PracticalEduLogo size={130} />
                </div>
              </div>
              
              <h1 className="text-xl font-black tracking-tight mb-2">البوابة الإلكترونية للتربية العملية</h1>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="h-px w-6 bg-amber-400/30"></span>
                <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em]">كلية التربية - جامعة الأزهر</p>
                <span className="h-px w-6 bg-amber-400/30"></span>
              </div>
              <p className="text-amber-300/90 text-[10px] font-bold tracking-widest">تفهنا الأشراف - الدقهلية</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-white">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 mr-2 text-right uppercase tracking-widest">الاسم الكامل رباعياً</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-right text-slate-800 font-bold"
                placeholder="أدخل اسمك كما في الكشف"
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
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-center tracking-[0.2em] font-mono text-lg text-[#055039] font-black"
                placeholder="00000000000000"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 mr-2 text-right uppercase tracking-widest">رقم الهاتف</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" 
                  value={phoneNumber}
                  maxLength={11}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-center font-bold text-slate-700"
                  placeholder="01xxxxxxxxx"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#055039] hover:bg-[#032e21] text-white font-black py-4 rounded-2xl transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 text-base relative group overflow-hidden"
            >
              <ShieldCheck size={20} className="text-amber-400" />
              <span>تسجيل الدخول الآمن</span>
            </button>
            
            <div className="pt-2 text-center">
              <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase tracking-tighter">
                وحدة نظم المعلومات <br/>
                قسم المناهج وطرق التدريس
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
