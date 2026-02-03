
import React, { useState } from 'react';
import { PracticalEduLogo } from './VectorLogo';
import { Phone, ShieldCheck, User } from 'lucide-react';

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
      alert("خطأ: يجب أن يتكون رقم الهاتف من 11 رقماً (مثال: 01234567890)");
      return;
    }

    onLogin(username, nationalId, phoneNumber);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#042f22]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-pattern" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
              <path d="M75 0 L90 60 L150 75 L90 90 L75 150 L60 90 L0 75 L60 60 Z" fill="none" stroke="#fbbf24" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full"></div>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-emerald-800/20">
          
          <div className="bg-gradient-to-br from-[#055039] to-[#022c1f] p-12 text-center text-white relative">
            <div className="relative z-10">
              <div className="relative mx-auto w-40 h-40 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-white rounded-full scale-110 shadow-xl"></div>
                <div className="relative z-10 scale-125">
                  <PracticalEduLogo size={120} />
                </div>
              </div>
              
              <h1 className="text-2xl font-black tracking-tight mb-2">منصة التربية العملية</h1>
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="h-0.5 w-8 bg-amber-400/40"></span>
                <p className="text-emerald-100 text-xs font-black uppercase tracking-widest">جامعة الأزهر</p>
                <span className="h-0.5 w-8 bg-amber-400/40"></span>
              </div>
              <p className="text-amber-400 text-[10px] font-bold tracking-widest uppercase">كلية التربية - تفهنا الأشراف</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-5">
            {/* الاسم الكامل */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mr-2 text-right uppercase tracking-widest">
                <User size={12} className="text-emerald-600" />
                الاسم الكامل رباعياً كما في الكشف
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-right text-slate-800 font-bold"
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>
            
            {/* الرقم القومي */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mr-2 text-right uppercase tracking-widest">
                <ShieldCheck size={12} className="text-emerald-600" />
                الرقم القومي (14 رقم)
              </label>
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

            {/* رقم الهاتف */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 mr-2 text-right uppercase tracking-widest">
                <Phone size={12} className="text-emerald-600" />
                رقم الهاتف المحمول (11 رقم)
              </label>
              <input 
                type="text" 
                value={phoneNumber}
                maxLength={11}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-center tracking-[0.1em] font-mono text-lg text-[#055039] font-black"
                placeholder="01000000000"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#055039] hover:bg-[#032e21] text-white font-black py-5 mt-4 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 text-lg group overflow-hidden active:scale-95"
            >
              <ShieldCheck size={22} className="text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>دخول النظام</span>
            </button>
            
            <p className="text-[10px] text-slate-400 text-center font-bold mt-2">
              © قسم المناهج وطرق التدريس - ٢٠٢٥
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
