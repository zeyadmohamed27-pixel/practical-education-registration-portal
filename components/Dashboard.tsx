
import React, { useState, useMemo, useEffect } from 'react';
import { User, Institute, Student, Year } from '../types';
import { DEPARTMENTS } from '../constants';
import { 
  LogOut, GraduationCap, School, FileText, UserPlus, 
  Info, Users, Lock, Trash2, X, Edit2, PlusCircle, 
  Download, Printer, ChevronDown, ChevronUp, MapPin,
  Settings, UserCheck, Mail, Send, Phone, Globe, ClipboardList,
  ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, ChevronLeft, Search, RefreshCw, Sparkles,
  ChevronRight, ListFilter
} from 'lucide-react';
import LetterGenerator from './LetterGenerator';
import WelcomeOverlay from './WelcomeOverlay';
import { PracticalEduLogo, AzharLogo } from './VectorLogo';

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
  
  // الحالة الجديدة لمتابعة المعهد الذي يتم عرض طلابه
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
    setViewingInstituteId(null); // إعادة تعيين عرض الطلاب عند تغيير القسم
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

  // الطلاب في المعهد المختار تحديداً
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

      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 no-print">
        <div className="flex items-center gap-6">
          <div className="relative flex items-center pr-2">
            <div className="bg-white p-1 rounded-full border-2 border-sky-100 shadow-md w-24 h-24 flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-300 relative z-10">
              <PracticalEduLogo size={80} />
            </div>
            <div className="absolute -left-6 bottom-0 bg-white p-1 rounded-full border-2 border-emerald-100 shadow-lg w-16 h-16 flex items-center justify-center overflow-hidden transition-all hover:scale-110 hover:-translate-y-1 duration-300 z-20">
              <AzharLogo size={48} />
            </div>
          </div>
          
          <div className="text-right pr-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">بوابة التربية العملية</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sky-600 text-xs font-bold uppercase tracking-widest">كلية التربية - جامعة الأزهر</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <div className="text-right">
            <p className="text-sm font-black text-slate-700">{user.username}</p>
            <p className="text-[10px] text-sky-600 font-black tracking-tighter">الحساب: نشط الآن</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-4 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-2xl transition-all active:scale-95"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      <nav className="flex justify-center mb-12 no-print">
        <div className="bg-white p-2 rounded-[2.5rem] shadow-md border border-slate-100 flex gap-2 w-full max-w-2xl">
          <button 
            onClick={() => setActiveTab('registration')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${activeTab === 'registration' ? 'bg-sky-700 text-white shadow-xl shadow-sky-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <UserPlus size={20} />
            <span>التسجيل</span>
          </button>
          <button 
            onClick={() => setActiveTab('management')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${activeTab === 'management' ? 'bg-indigo-700 text-white shadow-xl shadow-indigo-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Settings size={20} />
            <span>الإدارة</span>
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${activeTab === 'contact' ? 'bg-slate-800 text-white shadow-xl shadow-slate-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Mail size={20} />
            <span>تواصل</span>
          </button>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        {(activeTab === 'registration' || activeTab === 'management') && (
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2 text-right">الفرقة الدراسية</h2>
              <div className="flex gap-1 bg-slate-100 p-2 rounded-2xl">
                <button 
                  onClick={() => setActiveYear('third')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeYear === 'third' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  الثالثة
                </button>
                <button 
                  onClick={() => setActiveYear('fourth')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeYear === 'fourth' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  الرابعة
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm p-4 border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-5 px-3">
                <div className="bg-sky-50 p-2.5 rounded-2xl text-sky-600">
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
                          ? (isSpecial ? 'bg-amber-600 text-white font-black shadow-lg shadow-amber-100' : 'bg-sky-700 text-white font-black shadow-lg shadow-sky-100')
                          : (isSpecial ? 'bg-amber-50/50 text-amber-700 hover:bg-amber-100' : 'text-slate-600 hover:bg-sky-50')}`}
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
              <div className="bg-white p-8 rounded-3xl border border-sky-100 border-r-8 border-r-sky-600 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-right">
                  <h3 className="text-2xl font-black text-sky-900">المعاهد المتاحة للتوزيع</h3>
                  <p className="text-slate-500 font-medium">اختر المعهد الذي ترغب في التدرب به</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن معهد..."
                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50 rounded-2xl border-2 border-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-right text-sm font-bold"
                  />
                </div>
              </div>

              {specialEducationNotice && (
                <div className="bg-amber-50 border-r-4 border-amber-500 p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                    <Sparkles size={20} />
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
                  <section key={location} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <button onClick={() => toggleLocationCollapse(location)} className="w-full flex items-center justify-between p-6 hover:bg-sky-50/20">
                      <ChevronDown className={`text-slate-400 transition-transform ${collapsedLocations[location] ? 'rotate-180' : ''}`} />
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black bg-sky-100 text-sky-700 px-3 py-1.5 rounded-xl">{insts.length} معاهد</span>
                        <h4 className="font-bold text-slate-800 text-lg">{location}</h4>
                        <MapPin size={20} className="text-sky-500" />
                      </div>
                    </button>
                    {!collapsedLocations[location] && (
                      <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {insts.map(inst => (
                          <div key={inst.id} className={`p-6 border-2 rounded-3xl transition-all relative ${inst.currentCount >= inst.maxCapacity ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 hover:border-sky-300'}`}>
                            <div className="flex justify-between items-start mb-6">
                              <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${inst.currentCount >= inst.maxCapacity ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'}`}>
                                {inst.currentCount >= inst.maxCapacity ? 'مكتمل' : 'متاح'}
                              </span>
                              <h5 className="font-black text-slate-800 text-base">{inst.name}</h5>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-sm font-bold text-slate-500">{inst.currentCount} / {inst.maxCapacity} طالب</span>
                              {inst.currentCount < inst.maxCapacity ? (
                                <button 
                                  onClick={() => handleRegisterClick(inst)}
                                  className="bg-sky-700 text-white px-6 py-2 rounded-xl font-black text-sm hover:bg-sky-800 transition-all active:scale-95"
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
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-[2.5rem] border-2 border-dashed border-indigo-100">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600 animate-pulse">
                    <Lock size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">منطقة محمية</h3>
                  <form onSubmit={handleAdminLogin} className="w-full max-w-xs space-y-4">
                    <input 
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="كلمة المرور الإدارية"
                      className="w-full p-5 bg-slate-50 rounded-2xl border-2 text-center text-xl font-bold tracking-[0.5em] focus:border-indigo-500 outline-none transition-all"
                      autoFocus
                    />
                    <button type="submit" className="w-full bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-800">دخول</button>
                    {loginError && <p className="text-rose-600 text-center font-bold text-sm">عذراً، كلمة المرور غير صحيحة</p>}
                  </form>
                </div>
              ) : (
                <>
                  <div className="bg-white p-8 rounded-3xl border border-indigo-100 border-r-8 border-r-indigo-600 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-right">
                      <h3 className="text-2xl font-black text-indigo-900">إدارة المعاهد والشُعب</h3>
                      <p className="text-slate-500 font-medium">إدارة التوزيع الجغرافي للمعاهد الحالية</p>
                    </div>
                    <div className="flex gap-4">
                       <button 
                        onClick={() => {
                          const n = prompt("اسم المعهد الجديد:");
                          const l = prompt("الموقع:");
                          if(n && l) onAddInstitute({name: n, location: l, maxCapacity: 6, departmentId: selectedDeptId, year: activeYear});
                        }}
                        className="bg-indigo-700 text-white flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-800 transition-all shadow-xl active:scale-95"
                      >
                        <PlusCircle size={22} /> إضافة معهد
                      </button>
                    </div>
                  </div>

                  {/* عرض قائمة المعاهد في الإدارة */}
                  {!viewingInstituteId ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h4 className="font-black text-slate-800 flex items-center gap-2">
                          <School size={18} className="text-indigo-600" />
                          المعاهد الحالية ({filteredInstitutes.length})
                        </h4>
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">انقر على المعهد لعرض طلابه</div>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredInstitutes.length === 0 ? (
                          <p className="col-span-full py-8 text-center text-slate-400 italic">لا توجد معاهد مضافة لهذه الشُعبة حالياً</p>
                        ) : (
                          filteredInstitutes.map(inst => (
                            <div key={inst.id} className="group relative flex flex-col p-5 bg-white rounded-2xl border-2 border-slate-50 hover:border-indigo-400 transition-all cursor-pointer shadow-sm hover:shadow-md" onClick={() => setViewingInstituteId(inst.id)}>
                              <div className="flex justify-between items-start mb-3">
                                <div className="text-right">
                                  <p className="font-black text-slate-800 text-sm">{inst.name}</p>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mt-1">
                                    <MapPin size={12} />
                                    <span>{inst.location}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); confirmDeleteInstitute(inst); }}
                                  className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                  title="حذف المعهد"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                  {inst.currentCount} / {inst.maxCapacity} طالب
                                </span>
                                <ChevronLeft size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    /* عرض طلاب المعهد المختار */
                    <div className="animate-in slide-in-from-left-6 duration-500 space-y-6">
                      <div className="bg-indigo-700 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -translate-x-10 -translate-y-10"></div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                          <div className="flex items-center gap-5 text-right">
                            <button 
                              onClick={() => setViewingInstituteId(null)}
                              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                            >
                              <ChevronRight size={24} />
                            </button>
                            <div>
                              <h4 className="text-2xl font-black">{activeViewingInstitute?.name}</h4>
                              <p className="text-indigo-200 text-sm font-bold flex items-center gap-2 mt-1">
                                <MapPin size={14} /> {activeViewingInstitute?.location} | 
                                <Users size={14} /> {selectedInstStudents.length} طلاب مسجلين
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button 
                              onClick={() => window.print()} 
                              className="flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg"
                            >
                              <Printer size={18} /> طباعة الكشف
                            </button>
                            <button 
                              onClick={() => { setLetterInstituteId(viewingInstituteId); setShowLetter(true); }}
                              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-500 transition-all border border-indigo-400/30"
                            >
                              <FileText size={18} /> خطاب التوجيه
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-right">
                            <thead className="bg-slate-50 border-b border-slate-100">
                              <tr>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase">م</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase">الاسم رباعياً</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase text-center">الرقم القومي</th>
                                <th className="p-6 text-xs font-black text-slate-400 uppercase text-center">الإجراءات</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedInstStudents.map((s, i) => (
                                <tr key={s.id} className="hover:bg-indigo-50/10 transition-colors">
                                  <td className="p-6 text-sm font-bold text-slate-400">{i + 1}</td>
                                  <td className="p-6 text-base font-black text-slate-700">{s.name}</td>
                                  <td className="p-6 text-center text-sm font-mono text-slate-500">{s.nationalId}</td>
                                  <td className="p-6 text-center">
                                    <button 
                                      onClick={() => { if(window.confirm(`هل أنت متأكد من حذف الطالب: ${s.name} من هذه المجموعة؟`)) onRemoveStudent(s.id, s.instituteId); }}
                                      className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                      title="حذف الطالب"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {selectedInstStudents.length === 0 && (
                            <div className="p-20 text-center text-slate-400 flex flex-col items-center gap-4">
                              <ListFilter size={48} className="opacity-20" />
                              <p className="italic font-bold">لا يوجد طلاب مسجلين في هذا المعهد حالياً</p>
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
            <div className="animate-in zoom-in-95 duration-500 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100 text-right flex flex-col justify-center space-y-10 border-r-8 border-r-slate-800">
                <h3 className="text-4xl font-black text-slate-800 mb-4">الدعم الفني</h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-5 justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">البريد الجامعي</p>
                      <p className="text-xl font-black text-slate-700">edu.tafhana@azhar.edu.eg</p>
                    </div>
                    <div className="bg-slate-100 p-5 rounded-3xl text-slate-600"><Mail size={28} /></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("شكراً لتواصلك، سيتم الرد عليك قريباً."); }}>
                  <input type="text" placeholder="الاسم" className="w-full p-5 bg-slate-50 rounded-2xl text-right font-bold outline-none border-2 border-transparent focus:border-slate-300" required />
                  <textarea placeholder="رسالتك أو استفسارك..." rows={6} className="w-full p-5 bg-slate-50 rounded-2xl text-right font-bold outline-none resize-none border-2 border-transparent focus:border-slate-300" required></textarea>
                  <button type="submit" className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-900 transition-all active:scale-95">إرسال الطلب</button>
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
