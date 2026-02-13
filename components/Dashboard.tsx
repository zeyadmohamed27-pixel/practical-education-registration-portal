
import React, { useState, useMemo, useEffect } from 'react';
import { User, Institute, Student, Year } from '../types';
import { DEPARTMENTS } from '../constants';
import { 
  LogOut, GraduationCap, School, FileText, UserPlus, 
  Users, Lock, Trash2, X, PlusCircle, 
  Printer, ChevronDown, MapPin,
  Settings, Mail, ShieldCheck, CheckCircle2, ChevronLeft, Search, Sparkles,
  ChevronRight, ListFilter
} from 'lucide-react';
import LetterGenerator from './LetterGenerator';
import WelcomeOverlay from './WelcomeOverlay';
import { AzharLogo } from './VectorLogo';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  institutes: Institute[];
  students: Student[];
  onRegister: (student: Student) => void;
  onRemoveStudent: (studentId: string, instituteId: string) => void;
  onAddInstitute: (newInst: Omit<Institute, 'id' | 'currentCount'>) => void;
  onUpdateInstitute: (id: string, newName: string) => void;
  onDeleteInstitute: (id: string) => void;
}

type Tab = 'registration' | 'management' | 'contact';

const Dashboard: React.FC<DashboardProps> = ({ 
  user, onLogout, institutes, students, onRegister, onRemoveStudent, 
  onAddInstitute, onUpdateInstitute, onDeleteInstitute 
}) => {
  const [activeYear, setActiveYear] = useState<Year>('third');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(DEPARTMENTS[0].id);
  const [activeTab, setActiveTab] = useState<Tab>('registration');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [showLetter, setShowLetter] = useState(false);
  const [letterInstituteId, setLetterInstituteId] = useState<string | null>(null);
  const [collapsedLocations, setCollapsedLocations] = useState<Record<string, boolean>>({});
  const [showWelcome, setShowWelcome] = useState(false);
  const [specialEducationNotice, setSpecialEducationNotice] = useState<string | null>(null);
  
  const [viewingInstituteId, setViewingInstituteId] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenWelcomeInSession = sessionStorage.getItem('welcome_seen');
    if (!hasSeenWelcomeInSession) setShowWelcome(true);
  }, []);

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('welcome_seen', 'true');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '2055') {
      setIsAdminAuthorized(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPasswordInput('');
    }
  };

  const handleDeptSelect = (deptId: string, deptName: string) => {
    setSelectedDeptId(deptId);
    setViewingInstituteId(null);
    if (deptId.startsWith('special_')) {
      setSpecialEducationNotice(deptName);
      setTimeout(() => setSpecialEducationNotice(null), 4000);
    } else {
      setSpecialEducationNotice(null);
    }
  };

  const filteredInstitutes = useMemo(() => 
    institutes.filter(inst => {
      const matchesYear = inst.year === activeYear;
      const matchesDept = inst.departmentId === selectedDeptId;
      const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           inst.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesYear && matchesDept && matchesSearch;
    }),
    [institutes, activeYear, selectedDeptId, searchTerm]
  );

  const institutesByLocation = useMemo(() => {
    return filteredInstitutes.reduce((acc, inst) => {
      if (!acc[inst.location]) acc[inst.location] = [];
      acc[inst.location].push(inst);
      return acc;
    }, {} as Record<string, Institute[]>);
  }, [filteredInstitutes]);

  const selectedInstStudents = useMemo(() => {
    if (!viewingInstituteId) return [];
    return students.filter(s => s.instituteId === viewingInstituteId)
      .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  }, [students, viewingInstituteId]);

  const getStudentsForInstitute = (instId: string) => {
    return students.filter(s => s.instituteId === instId);
  };

  const toggleLocationCollapse = (location: string) => {
    setCollapsedLocations(prev => ({ ...prev, [location]: !prev[location] }));
  };

  const confirmDeleteInstitute = (inst: Institute) => {
    const studentCount = getStudentsForInstitute(inst.id).length;
    const warningText = studentCount > 0 
      ? `🚨 تحذير: هذا المعهد يحتوي على (${studentCount}) طلاب مسجلين حالياً.\nحذف المعهد سيؤدي إلى إلغاء تسجيلهم جميعاً.\n\nهل أنت متأكد من حذف: ${inst.name}؟` 
      : `هل أنت متأكد من رغبتك في حذف معهد: (${inst.name})؟`;

    if (window.confirm(warningText)) {
      onDeleteInstitute(inst.id);
      if (viewingInstituteId === inst.id) setViewingInstituteId(null);
    }
  };

  const handleRegisterClick = (inst: Institute) => {
    if (inst.currentCount >= inst.maxCapacity) {
      alert("عذراً، المجموعة مكتملة");
      return;
    }

    const alreadyRegistered = students.find(s => s.nationalId === user.nationalId);
    if (alreadyRegistered) {
      const targetInst = institutes.find(i => i.id === alreadyRegistered.instituteId);
      alert(`(تم التسجيل من قبل) \nأنت مسجل بالفعل في: ${targetInst?.name || 'معهد آخر'}`);
      return;
    }

    const isConfirmed = window.confirm(`هل أنت متأكد من رغبتك في التسجيل بمعهد: (${inst.name})؟`);
    if (!isConfirmed) return;

    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: user.username,
      nationalId: user.nationalId,
      year: activeYear,
      departmentId: selectedDeptId,
      instituteId: inst.id
    };

    onRegister(newStudent);
    alert("تم تسجيلك بنجاح في المجموعة.");
  };

  const activeViewingInstitute = institutes.find(i => i.id === viewingInstituteId);

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      {showWelcome && <WelcomeOverlay username={user.username} onDismiss={handleDismissWelcome} />}

      <header className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 no-print">
        <div className="flex items-center gap-4">
          <AzharLogo size={80} />
          
          <div className="text-right">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">بوابة التربية العملية</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-emerald-700 text-sm font-black uppercase tracking-widest">كلية التربية - جامعة الأزهر</p>
            </div>
            <p className="text-amber-600 text-[10px] font-bold mt-1 uppercase tracking-tighter">تفهنا الأشراف - قسم المناهج</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-8 md:mt-0">
          <div className="text-right bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <p className="text-sm font-black text-slate-700">{user.username}</p>
            <p className="text-[10px] text-emerald-600 font-black tracking-widest">نشط الآن</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-5 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm active:scale-95"
            title="خروج"
          >
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <nav className="flex justify-center mb-12 no-print">
        <div className="bg-white p-2.5 rounded-[3rem] shadow-md border border-slate-100 flex gap-2 w-full max-w-2xl">
          <button 
            onClick={() => setActiveTab('registration')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2.5rem] font-black text-sm transition-all duration-300 ${activeTab === 'registration' ? 'bg-[#055039] text-white shadow-xl shadow-emerald-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <UserPlus size={20} />
            <span>التسجيل</span>
          </button>
          <button 
            onClick={() => setActiveTab('management')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2.5rem] font-black text-sm transition-all duration-300 ${activeTab === 'management' ? 'bg-[#055039] text-white shadow-xl shadow-emerald-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Settings size={20} />
            <span>الإدارة</span>
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2.5rem] font-black text-sm transition-all duration-300 ${activeTab === 'contact' ? 'bg-[#055039] text-white shadow-xl shadow-emerald-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Mail size={20} />
            <span>تواصل</span>
          </button>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        {(activeTab === 'registration' || activeTab === 'management') && (
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm p-6 border border-slate-100">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2 text-right">الفرقة الدراسية</h2>
              <div className="flex gap-1 bg-slate-100 p-2 rounded-2xl">
                <button 
                  onClick={() => setActiveYear('third')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeYear === 'third' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  الثالثة
                </button>
                <button 
                  onClick={() => setActiveYear('fourth')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeYear === 'fourth' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  الرابعة
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm p-5 border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-5 px-3">
                <div className="bg-emerald-50 p-2.5 rounded-2xl text-emerald-600">
                  <GraduationCap size={18} />
                </div>
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">التخصص العلمي</h2>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {DEPARTMENTS.map(dept => {
                  const isActive = selectedDeptId === dept.id;
                  const isSpecial = dept.id.startsWith('special_');
                  
                  return (
                    <button 
                      key={dept.id}
                      onClick={() => handleDeptSelect(dept.id, dept.name)}
                      className={`w-full text-right px-4 py-4 rounded-2xl text-xs transition-all duration-300 flex items-center justify-between group
                        ${isActive 
                          ? (isSpecial ? 'bg-amber-600 text-white font-black shadow-lg' : 'bg-[#055039] text-white font-black shadow-lg shadow-emerald-900/10')
                          : (isSpecial ? 'bg-amber-50/50 text-amber-700 hover:bg-amber-100' : 'text-slate-600 hover:bg-emerald-50')}`}
                    >
                      <div className="flex items-center gap-2">
                        {isSpecial && <Sparkles size={12} className={isActive ? 'text-amber-200' : 'text-amber-500'} />}
                        <span className="leading-tight">{dept.name}</span>
                      </div>
                      {isActive && <CheckCircle2 size={16} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        <main className={`${activeTab === 'contact' ? 'lg:col-span-12' : 'lg:col-span-9'} space-y-6`}>
          {activeTab === 'registration' && (
            <div className="animate-in slide-in-from-left-6 duration-500 space-y-6">
              <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 border-r-8 border-r-[#055039] flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-right">
                  <h3 className="text-2xl font-black text-emerald-900">المعاهد المتاحة للتوزيع</h3>
                  <p className="text-slate-500 font-medium">اختر المعهد الذي ترغب في التدرب به</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن معهد..."
                    className="w-full pl-4 pr-12 py-4 bg-slate-50 rounded-2xl border-2 border-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-right text-sm font-bold shadow-inner"
                  />
                </div>
              </div>

              {specialEducationNotice && (
                <div className="bg-amber-50 border-r-4 border-amber-500 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
                  <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <p className="text-amber-900 text-sm font-black">تم تفعيل مرشح التخصص الدقيق</p>
                    <p className="text-amber-700 text-xs font-bold mt-0.5">
                      يتم الآن عرض معاهد الدمج المخصصة لمسار <span className="underline decoration-2 underline-offset-4 font-black">{specialEducationNotice}</span> فقط.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {(Object.entries(institutesByLocation) as [string, Institute[]][]).map(([location, insts]) => (
                  <section key={location} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <button onClick={() => toggleLocationCollapse(location)} className="w-full flex items-center justify-between p-8 hover:bg-emerald-50/20">
                      <ChevronDown className={`text-slate-400 transition-transform ${collapsedLocations[location] ? 'rotate-180' : ''}`} />
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl">{insts.length} معاهد</span>
                        <h4 className="font-black text-slate-800 text-xl">{location}</h4>
                        <MapPin size={22} className="text-emerald-500" />
                      </div>
                    </button>
                    {!collapsedLocations[location] && (
                      <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {insts.map(inst => (
                          <div key={inst.id} className={`p-7 border-2 rounded-[2rem] transition-all relative ${inst.currentCount >= inst.maxCapacity ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 hover:border-emerald-300 shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-6">
                              <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-full ${inst.currentCount >= inst.maxCapacity ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {inst.currentCount >= inst.maxCapacity ? 'مكتمل' : 'متاح للتسجيل'}
                              </span>
                              <h5 className="font-black text-slate-800 text-lg">{inst.name}</h5>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                              <span className="text-sm font-bold text-slate-500">{inst.currentCount} / {inst.maxCapacity} طالب</span>
                              {inst.currentCount < inst.maxCapacity ? (
                                <button 
                                  onClick={() => handleRegisterClick(inst)}
                                  className="bg-[#055039] text-white px-8 py-2.5 rounded-2xl font-black text-sm hover:bg-emerald-800 transition-all active:scale-95 shadow-md"
                                >
                                  حجز مكان
                                </button>
                              ) : (
                                <span className="text-rose-500 font-bold text-xs italic">لا توجد أماكن</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'management' && (
            <div className="animate-in slide-in-from-right-6 duration-500 space-y-6">
              {!isAdminAuthorized ? (
                <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-[3rem] border-2 border-dashed border-emerald-100 shadow-inner">
                  <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-8 text-[#055039] animate-pulse">
                    <Lock size={44} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">منطقة الإدارة المحمية</h3>
                  <form onSubmit={handleAdminLogin} className="w-full max-w-xs space-y-5">
                    <input 
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="كلمة المرور الإدارية"
                      className="w-full p-6 bg-slate-100 rounded-[1.5rem] border-2 border-transparent text-center text-2xl font-bold tracking-[0.5em] focus:bg-white focus:border-emerald-500 outline-none transition-all shadow-inner"
                      autoFocus
                    />
                    <button type="submit" className="w-full bg-[#055039] text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-emerald-900 shadow-xl active:scale-95">دخول</button>
                    {loginError && <p className="text-rose-600 text-center font-black text-sm">عذراً، كلمة المرور غير صحيحة</p>}
                  </form>
                </div>
              ) : (
                <>
                  <div className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 border-r-8 border-r-emerald-600 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                    <div className="text-right">
                      <h3 className="text-2xl font-black text-emerald-900">إدارة المعاهد والشُعب</h3>
                      <p className="text-slate-500 font-medium italic">إدارة التوزيع الجغرافي للمعاهد الحالية</p>
                    </div>
                    <div className="flex gap-4">
                       <button 
                        onClick={() => {
                          const n = prompt("اسم المعهد الجديد:");
                          const l = prompt("الموقع الجغرافي:");
                          if(n && l) onAddInstitute({name: n, location: l, maxCapacity: 6, departmentId: selectedDeptId, year: activeYear});
                        }}
                        className="bg-[#055039] text-white flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-sm hover:bg-emerald-800 transition-all shadow-lg active:scale-95"
                      >
                        <PlusCircle size={24} /> إضافة معهد جديد
                      </button>
                    </div>
                  </div>

                  {!viewingInstituteId ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h4 className="font-black text-slate-800 flex items-center gap-3">
                          <School size={22} className="text-[#055039]" />
                          قائمة المعاهد ({filteredInstitutes.length})
                        </h4>
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full">اختر معهداً للعرض</div>
                      </div>
                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInstitutes.length === 0 ? (
                          <p className="col-span-full py-12 text-center text-slate-400 italic font-bold">لا توجد معاهد مضافة لهذه الشُعبة حالياً</p>
                        ) : (
                          filteredInstitutes.map(inst => (
                            <div key={inst.id} className="group relative flex flex-col p-6 bg-white rounded-[2rem] border-2 border-slate-50 hover:border-emerald-500 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1" onClick={() => setViewingInstituteId(inst.id)}>
                              <div className="flex justify-between items-start mb-4">
                                <div className="text-right">
                                  <p className="font-black text-slate-800 text-base">{inst.name}</p>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mt-1.5">
                                    <MapPin size={14} className="text-emerald-500" />
                                    <span>{inst.location}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); confirmDeleteInstitute(inst); }}
                                  className="p-3 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                  title="حذف المعهد"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl">
                                  {inst.currentCount} / {inst.maxCapacity} مسجل
                                </span>
                                <ChevronLeft size={20} className="text-slate-300 group-hover:text-emerald-500 transition-all group-hover:-translate-x-1" />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in slide-in-from-left-6 duration-500 space-y-6">
                      <div className="bg-[#055039] text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 blur-3xl rounded-full -translate-x-12 -translate-y-12"></div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                          <div className="flex items-center gap-6 text-right">
                            <button 
                              onClick={() => setViewingInstituteId(null)}
                              className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all shadow-inner"
                            >
                              <ChevronRight size={28} />
                            </button>
                            <div>
                              <h4 className="text-3xl font-black">{activeViewingInstitute?.name}</h4>
                              <p className="text-emerald-100 text-base font-bold flex items-center gap-3 mt-2">
                                <MapPin size={16} /> {activeViewingInstitute?.location} | 
                                <Users size={16} /> {selectedInstStudents.length} طلاب مسجلين فعلياً
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <button 
                              onClick={() => window.print()} 
                              className="flex items-center gap-3 bg-white text-[#055039] px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all shadow-xl active:scale-95"
                            >
                              <Printer size={20} /> طباعة الكشف
                            </button>
                            <button 
                              onClick={() => { setLetterInstituteId(viewingInstituteId); setShowLetter(true); }}
                              className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-500 transition-all border border-emerald-400/30 active:scale-95 shadow-lg"
                            >
                              <FileText size={20} /> خطاب التوجيه
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-right">
                            <thead className="bg-slate-50 border-b border-slate-100">
                              <tr>
                                <th className="p-8 text-xs font-black text-slate-400 uppercase">م</th>
                                <th className="p-8 text-xs font-black text-slate-400 uppercase">الاسم الكامل للطالب</th>
                                <th className="p-8 text-xs font-black text-slate-400 uppercase text-center">الرقم القومي</th>
                                <th className="p-8 text-xs font-black text-slate-400 uppercase text-center">الإجراءات</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedInstStudents.map((s, i) => (
                                <tr key={s.id} className="hover:bg-emerald-50/10 transition-colors">
                                  <td className="p-8 text-sm font-bold text-slate-400">{i + 1}</td>
                                  <td className="p-8 text-lg font-black text-slate-700">{s.name}</td>
                                  <td className="p-8 text-center text-sm font-mono text-slate-500 font-bold">{s.nationalId}</td>
                                  <td className="p-8 text-center">
                                    <button 
                                      onClick={() => { if(window.confirm(`هل أنت متأكد من حذف الطالب: ${s.name}؟`)) onRemoveStudent(s.id, s.instituteId); }}
                                      className="p-4 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm active:scale-95"
                                      title="حذف الطالب"
                                    >
                                      <Trash2 size={22} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {selectedInstStudents.length === 0 && (
                            <div className="p-24 text-center text-slate-400 flex flex-col items-center gap-6">
                              <div className="p-6 bg-slate-50 rounded-full">
                                <ListFilter size={60} className="opacity-10" />
                              </div>
                              <p className="italic font-black text-lg">لا يوجد طلاب مسجلين في هذا المعهد حالياً</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="animate-in zoom-in-95 duration-500 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-14 rounded-[3rem] shadow-sm border border-slate-100 text-right flex flex-col justify-center space-y-12 border-r-[12px] border-r-[#055039]">
                <h3 className="text-4xl font-black text-slate-800">الدعم الفني</h3>
                <p className="text-slate-500 font-bold leading-relaxed text-lg italic">نحن هنا لخدمة معلمي المستقبل. في حال واجهت أي صعوبة، لا تتردد في مراسلتنا.</p>
                <div className="space-y-10">
                  <div className="flex items-center gap-6 justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">البريد الرسمي</p>
                      <p className="text-xl font-black text-[#055039] hover:underline cursor-pointer">edu.tafhana@azhar.edu.eg</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-[2rem] text-emerald-700 shadow-inner"><Mail size={32} /></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-14 rounded-[3.5rem] shadow-sm border border-slate-100">
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("شكراً لتواصلك يا معلم المستقبل، سيتم الرد عليك قريباً."); }}>
                  <input type="text" placeholder="الاسم الكامل" className="w-full p-5 bg-slate-50 rounded-2xl text-right font-bold outline-none border-2 border-transparent focus:border-emerald-300 focus:bg-white transition-all shadow-inner" required />
                  <textarea placeholder="رسالتك أو استفسارك..." rows={6} className="w-full p-6 bg-slate-50 rounded-2xl text-right font-bold outline-none resize-none border-2 border-transparent focus:border-emerald-300 focus:bg-white transition-all shadow-inner" required></textarea>
                  <button type="submit" className="w-full bg-[#055039] text-white py-6 rounded-[2rem] font-black text-2xl hover:bg-emerald-900 transition-all active:scale-95 shadow-xl shadow-emerald-900/10">إرسال الطلب</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {showLetter && letterInstituteId && (
        <LetterGenerator 
          institute={institutes.find(i => i.id === letterInstituteId)!}
          students={getStudentsForInstitute(letterInstituteId)}
          onClose={() => setShowLetter(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
