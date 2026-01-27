
import React, { useState, useMemo, useEffect } from 'react';
import { User, Institute, Student, Year } from '../types';
import { DEPARTMENTS } from '../constants';
import { 
  LogOut, GraduationCap, School, FileText, UserPlus, 
  Info, Users, Lock, Trash2, X, Edit2, PlusCircle, 
  Download, Printer, ChevronDown, ChevronUp, MapPin,
  Settings, UserCheck, Mail, Send, Phone, Globe, ClipboardList,
  ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, ChevronLeft, Search
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

  const studentsInSection = students.filter(
    s => s.year === activeYear && s.departmentId === selectedDeptId
  ).sort((a, b) => a.name.localeCompare(b.name, 'ar'));

  const getStudentsForInstitute = (instId: string) => {
    return students.filter(s => s.instituteId === instId);
  };

  const toggleLocationCollapse = (location: string) => {
    setCollapsedLocations(prev => ({ ...prev, [location]: !prev[location] }));
  };

  const handleDeleteInstitute = (inst: Institute) => {
    const studentsInInst = students.filter(s => s.instituteId === inst.id);
    const message = studentsInInst.length > 0 
      ? `تحذير: هذا المعهد يحتوي على (${studentsInInst.length}) طلاب مسجلين. هل أنت متأكد من حذف المعهد وإلغاء تسجيل الطلاب؟` 
      : `هل أنت متأكد من رغبتك في حذف معهد: (${inst.name})؟`;
    
    if (window.confirm(message)) {
      onDeleteInstitute(inst.id);
    }
  };

  const handleRegisterClick = (inst: Institute) => {
    if (inst.currentCount >= 6) {
      alert("عذراً، المجموعة مكتملة");
      return;
    }
    const isConfirmed = window.confirm(`هل أنت متأكد من رغبتك في التسجيل بمعهد: (${inst.name})؟`);
    if (!isConfirmed) return;

    const name = prompt("يرجى إدخال اسم الطالب رباعياً:");
    const nationalId = prompt("يرجى إدخال الرقم القومي للطالب (14 رقم):");

    if (name?.trim() && nationalId?.trim() && nationalId.length === 14) {
      const newStudent: Student = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        nationalId: nationalId.trim(),
        year: activeYear,
        departmentId: selectedDeptId,
        instituteId: inst.id
      };
      onRegister(newStudent);
      alert("تم تسجيل الطالب بنجاح.");
    } else {
      alert("خطأ في البيانات، يرجى التأكد من كتابة الاسم والرقم القومي بشكل صحيح (14 رقم).");
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
      {showWelcome && <WelcomeOverlay username={user.username} onDismiss={handleDismissWelcome} />}

      {/* Modern Top Navigation Bar with Dual Logos */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 no-print">
        <div className="flex items-center gap-6">
          {/* Dual Logo Container */}
          <div className="relative flex items-center pr-2">
            {/* Main Practical Education Logo */}
            <div className="bg-white p-1 rounded-full border-2 border-sky-100 shadow-md w-24 h-24 flex items-center justify-center overflow-hidden transition-transform hover:scale-105 duration-300 relative z-10">
              <PracticalEduLogo size={80} />
            </div>
            {/* Al-Azhar University Logo - Vector */}
            <div className="absolute -left-6 bottom-0 bg-white p-1 rounded-full border-2 border-emerald-100 shadow-lg w-16 h-16 flex items-center justify-center overflow-hidden transition-all hover:scale-110 hover:-translate-y-1 duration-300 z-20">
              <AzharLogo size={48} />
            </div>
          </div>
          
          <div className="text-right pr-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">بوابة التربية العملية</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sky-600 text-xs font-bold uppercase tracking-widest">{DEPARTMENTS.find(d => d.id === selectedDeptId)?.name}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <div className="text-right">
            <p className="text-sm font-black text-slate-700">{user.username}</p>
            <p className="text-[10px] text-sky-600 font-black tracking-tighter">الحساب: طالب مسجل</p>
          </div>
          <button 
            onClick={onLogout}
            className="p-4 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-2xl transition-all active:scale-95"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      {/* Custom Tabs Navigation */}
      <nav className="flex justify-center mb-12 no-print">
        <div className="bg-white p-2 rounded-[2.5rem] shadow-md border border-slate-100 flex gap-2 w-full max-w-2xl">
          <button 
            onClick={() => setActiveTab('registration')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${activeTab === 'registration' ? 'bg-sky-700 text-white shadow-xl shadow-sky-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <UserPlus size={20} />
            <span>تسجيل الطلاب</span>
          </button>
          <button 
            onClick={() => setActiveTab('management')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${activeTab === 'management' ? 'bg-indigo-700 text-white shadow-xl shadow-indigo-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Settings size={20} />
            <span>إدارة الموقع</span>
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${activeTab === 'contact' ? 'bg-slate-800 text-white shadow-xl shadow-slate-200 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Mail size={20} />
            <span>تواصل معنا</span>
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
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">اختر التخصص الدراسي</h2>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {DEPARTMENTS.map(dept => {
                  const isActive = selectedDeptId === dept.id;
                  return (
                    <button 
                      key={dept.id}
                      onClick={() => setSelectedDeptId(dept.id)}
                      className={`w-full text-right px-4 py-4 rounded-2xl text-xs transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                        ${isActive 
                          ? 'bg-sky-700 text-white font-black shadow-lg shadow-sky-100 translate-x-1' 
                          : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-transparent hover:border-sky-100'}`}
                    >
                      {isActive && (
                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-orange-400"></div>
                      )}
                      <div className="flex items-center gap-3">
                        {isActive ? (
                          <CheckCircle2 size={16} className="text-sky-300 animate-in zoom-in" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-sky-300 transition-colors"></div>
                        )}
                        <span className="relative z-10 leading-tight">{dept.name}</span>
                      </div>
                      {isActive && <ChevronLeft size={14} className="text-sky-300/50" />}
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
                  <p className="text-slate-500 font-medium">اختر المعهد الذي ترغب في التدرب به بعناية</p>
                </div>
                
                <div className="relative w-full md:w-80 group">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-sky-600 transition-colors">
                    <Search size={18} />
                  </div>
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن معهد أو موقع..."
                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50 rounded-2xl border-2 border-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-right text-sm font-bold placeholder:text-slate-400"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {filteredInstitutes.length === 0 && (
                <div className="bg-white p-16 rounded-[2.5rem] text-center border-2 border-dashed border-slate-100">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Search size={32} />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-2">عذراً، لم نجد ما تبحث عنه</h4>
                  <p className="text-slate-400 font-medium">حاول البحث بكلمات أخرى أو تأكد من اختيار التخصص الصحيح</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 text-sky-700 font-black text-sm hover:underline"
                  >
                    عرض كافة المعاهد
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {(Object.entries(institutesByLocation) as [string, Institute[]][]).map(([location, insts]) => (
                  <section key={location} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <button 
                      onClick={() => toggleLocationCollapse(location)}
                      className="w-full flex items-center justify-between p-6 hover:bg-sky-50/20 transition-colors"
                    >
                      <ChevronDown className={`text-slate-400 transition-transform duration-300 ${collapsedLocations[location] ? 'rotate-180' : ''}`} />
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black bg-sky-100 text-sky-700 px-3 py-1.5 rounded-xl">{insts.length} معاهد</span>
                        <h4 className="font-bold text-slate-800 text-lg">{location}</h4>
                        <MapPin size={20} className="text-sky-500" />
                      </div>
                    </button>
                    {!collapsedLocations[location] && (
                      <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {insts.map(inst => {
                          const isFull = inst.currentCount >= inst.maxCapacity;
                          const percentage = Math.round((inst.currentCount / inst.maxCapacity) * 100);
                          const remaining = inst.maxCapacity - inst.currentCount;
                          const isCritical = remaining <= 1 && !isFull;
                          
                          return (
                            <div key={inst.id} className={`p-6 border-2 rounded-3xl transition-all relative ${isFull ? 'bg-slate-50 border-slate-200 grayscale-[0.5]' : 'bg-white border-slate-100 hover:border-sky-300 hover:shadow-xl'}`}>
                              <div className="flex justify-between items-start mb-6">
                                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${isFull ? 'bg-rose-100 text-rose-600' : isCritical ? 'bg-orange-100 text-orange-600' : 'bg-sky-100 text-sky-600'}`}>
                                  {isFull ? 'مكتمل العدد' : isCritical ? 'بانتظار طالب واحد' : 'متاح للتسجيل'}
                                </span>
                                <h5 className="font-black text-slate-800 text-base text-right">{inst.name}</h5>
                              </div>

                              <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-end">
                                  <div className="flex flex-col text-right">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">سعة المجموعة</span>
                                    <span className={`text-lg font-black ${isFull ? 'text-rose-600' : 'text-sky-700'}`}>{inst.currentCount} <span className="text-slate-300 text-sm">/ {inst.maxCapacity}</span></span>
                                  </div>
                                  {!isFull && (
                                    <div className="text-left">
                                      <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">المتبقي</span>
                                      <span className={`px-2 py-1 rounded-lg text-xs font-black ${isCritical ? 'bg-orange-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>{remaining} أماكن</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="relative h-5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                                  <div 
                                    className={`absolute top-0 bottom-0 left-0 transition-all duration-1000 ease-out flex items-center justify-end px-2 ${
                                      isFull ? 'bg-gradient-to-r from-rose-400 to-rose-600' : 
                                      isCritical ? 'bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 
                                      'bg-gradient-to-r from-sky-400 to-sky-600'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  >
                                    {percentage > 15 && (
                                      <span className="text-[9px] font-black text-white bg-black/20 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                                        {percentage}%
                                      </span>
                                    )}
                                  </div>
                                  {!isFull && (
                                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[length:20px_20px] bg-[linear-gradient(45deg,rgba(255,255,255,.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] animate-[move-stripes_1s_linear_infinite]"></div>
                                  )}
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                  <MapPin size={14} />
                                  <span>{inst.location}</span>
                                </div>
                                {!isFull ? (
                                  <button 
                                    onClick={() => handleRegisterClick(inst)}
                                    className="group bg-sky-700 text-white pl-6 pr-8 py-3 rounded-2xl font-black text-sm hover:bg-sky-800 transition-all shadow-lg hover:shadow-sky-100 active:scale-95 flex items-center gap-3"
                                  >
                                    تسجيل الآن
                                    <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs italic">
                                    <AlertCircle size={14} />
                                    مجموعة مكتملة
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
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
                  <p className="text-slate-500 font-medium mb-8 text-center max-w-sm">يرجى إدخال كلمة المرور الخاصة بقسم المناهج وطرق التدريس للدخول إلى لوحة التحكم.</p>
                  
                  <form onSubmit={handleAdminLogin} className="w-full max-w-xs space-y-4">
                    <input 
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="رمز الدخول (4 أرقام)"
                      className={`w-full p-5 bg-slate-50 rounded-2xl border-2 text-center text-xl font-bold tracking-[0.5em] transition-all outline-none ${loginError ? 'border-rose-300 ring-4 ring-rose-50' : 'border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
                      autoFocus
                    />
                    <button type="submit" className="w-full bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 active:scale-95">تأكيد الهوية</button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="bg-white p-8 rounded-3xl border border-indigo-100 border-r-8 border-r-indigo-600 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-right">
                      <h3 className="text-2xl font-black text-indigo-900">لوحة تحكم المشرف</h3>
                      <p className="text-slate-500 font-medium">إدارة توزيع المعاهد ومراجعة كشوف الطلاب</p>
                    </div>
                    <button 
                      onClick={() => {
                        const n = prompt("اسم المعهد:");
                        const l = prompt("الموقع:");
                        if(n && l) onAddInstitute({name: n, location: l, maxCapacity: 6, departmentId: selectedDeptId, year: activeYear});
                      }}
                      className="bg-indigo-700 text-white flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-800 transition-all shadow-xl active:scale-95"
                    >
                      <PlusCircle size={22} /> إضافة معهد
                    </button>
                  </div>

                  {/* Manage Institutes Section */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                      <h4 className="font-black text-slate-800 flex items-center gap-2">
                        <School size={18} className="text-indigo-600" />
                        المعاهد المسجلة حالياً ({filteredInstitutes.length})
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">تخصص: {DEPARTMENTS.find(d => d.id === selectedDeptId)?.name}</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {filteredInstitutes.length === 0 ? (
                        <div className="col-span-3 py-8 text-center text-slate-400 italic text-sm">لا يوجد معاهد مضافة لهذا التخصص حالياً</div>
                      ) : (
                        filteredInstitutes.map(inst => (
                          <div key={inst.id} className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 hover:bg-indigo-50 transition-colors">
                            <div className="text-right">
                              <p className="font-bold text-slate-800 text-sm">{inst.name}</p>
                              <p className="text-[10px] text-slate-500">{inst.location} • {inst.currentCount}/6 طلاب</p>
                            </div>
                            <button 
                              onClick={() => handleDeleteInstitute(inst)}
                              className="p-2.5 text-rose-500 hover:bg-rose-100 rounded-xl transition-all"
                              title="حذف المعهد"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Registered Students Table */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center bg-indigo-50/20 gap-4">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-800 transition-all shadow-md">
                          <Download size={18} /> تصدير الكشف
                        </button>
                        <button onClick={() => window.print()} className="flex items-center gap-2 bg-white text-indigo-700 border-2 border-indigo-200 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all">
                          <Printer size={18} /> طباعة
                        </button>
                      </div>
                      <div className="text-right">
                        <h4 className="font-black text-slate-800 text-lg">جدول الطلاب المسجلين</h4>
                        <p className="text-indigo-600 text-xs font-black uppercase tracking-widest mt-1">العدد الحالي: {studentsInSection.length} طلاب</p>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase">م</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase">اسم الطالب الكامل</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase">المعهد الموزع عليه</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase text-center">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {studentsInSection.map((s, i) => (
                            <tr key={s.id} className="hover:bg-indigo-50/10 transition-colors">
                              <td className="p-6 text-sm font-bold text-slate-400">{i + 1}</td>
                              <td className="p-6">
                                <p className="text-base font-bold text-slate-700">{s.name}</p>
                                <p className="text-xs text-slate-400 font-mono mt-1">{s.nationalId}</p>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-col">
                                  <span className="text-sm font-black text-indigo-700">{institutes.find(inst => inst.id === s.instituteId)?.name}</span>
                                  <span className="text-[10px] text-slate-400 font-bold">{institutes.find(inst => inst.id === s.instituteId)?.location}</span>
                                </div>
                              </td>
                              <td className="p-6 text-center">
                                <div className="flex justify-center gap-3">
                                  <button 
                                    onClick={() => { setLetterInstituteId(s.instituteId); setShowLetter(true); }}
                                    className="p-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all"
                                  >
                                    <FileText size={20} />
                                  </button>
                                  <button 
                                    onClick={() => { if(window.confirm("حذف الطالب من المعهد؟")) onRemoveStudent(s.id, s.instituteId); }}
                                    className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {studentsInSection.length === 0 && (
                        <div className="p-12 text-center text-slate-400 text-sm italic">لا يوجد طلاب مسجلين في هذا القسم حالياً</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="animate-in zoom-in-95 duration-500 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100 text-right flex flex-col justify-center space-y-10 border-r-8 border-r-slate-800">
                <h3 className="text-4xl font-black text-slate-800 mb-4">الدعم والمساندة</h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-5 justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">البريد الإلكتروني</p>
                      <p className="text-xl font-black text-slate-700">edu.tafhana@azhar.edu.eg</p>
                    </div>
                    <div className="bg-slate-100 p-5 rounded-3xl text-slate-600"><Mail size={28} /></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="الاسم" className="w-full p-5 bg-slate-50 rounded-2xl text-right font-bold outline-none" required />
                  <textarea placeholder="الرسالة" rows={6} className="w-full p-5 bg-slate-50 rounded-2xl text-right font-bold outline-none resize-none" required></textarea>
                  <button type="submit" className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-900 transition-all">إرسال</button>
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

      {/* Animation Styles */}
      <style>{`
        @keyframes move-stripes {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
