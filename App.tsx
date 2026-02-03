
import React, { useState, useEffect, useCallback } from 'react';
import { User, Institute, Student } from './types';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import { INITIAL_INSTITUTES } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // تحميل البيانات الأولية مع التحقق من وجود بيانات سابقة
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedInstitutes = localStorage.getItem('institutes_v2');
    if (savedInstitutes) {
      setInstitutes(JSON.parse(savedInstitutes));
    } else {
      setInstitutes(INITIAL_INSTITUTES);
    }

    const savedStudents = localStorage.getItem('students_v2');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    
    setIsLoaded(true);
  }, []);

  // حفظ البيانات تلقائياً عند أي تغيير
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('institutes_v2', JSON.stringify(institutes));
    localStorage.setItem('students_v2', JSON.stringify(students));
  }, [institutes, students, isLoaded]);

  const handleLogin = (username: string, nationalId: string, phoneNumber: string) => {
    const newUser: User = { username, phoneNumber, nationalId, role: 'student' };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const registerStudent = useCallback((student: Student) => {
    setInstitutes(prev => prev.map(inst => {
      if (inst.id === student.instituteId) {
        return { ...inst, currentCount: inst.currentCount + 1 };
      }
      return inst;
    }));
    setStudents(prev => [...prev, student]);
  }, []);

  const removeStudent = useCallback((studentId: string, instituteId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setInstitutes(prev => prev.map(inst => 
      inst.id === instituteId 
        ? { ...inst, currentCount: Math.max(0, inst.currentCount - 1) }
        : inst
    ));
  }, []);

  const addInstitute = useCallback((newInst: Omit<Institute, 'id' | 'currentCount'>) => {
    const id = `${newInst.year}-${newInst.departmentId}-${Date.now()}`;
    const institute: Institute = { ...newInst, id, currentCount: 0 };
    setInstitutes(prev => [institute, ...prev]);
  }, []);

  const updateInstitute = useCallback((id: string, newName: string) => {
    setInstitutes(prev => prev.map(inst => inst.id === id ? { ...inst, name: newName } : inst));
  }, []);

  const deleteInstitute = useCallback((id: string) => {
    // حذف الطلاب المرتبطين أولاً
    setStudents(prev => prev.filter(s => s.instituteId !== id));
    // حذف المعهد
    setInstitutes(prev => prev.filter(inst => inst.id !== id));
  }, []);

  if (!isLoaded) return <div className="min-h-screen bg-sky-950 flex items-center justify-center text-white font-bold">جاري تحميل المنظومة...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            institutes={institutes}
            students={students}
            onRegister={registerStudent}
            onRemoveStudent={removeStudent}
            onAddInstitute={addInstitute}
            onUpdateInstitute={updateInstitute}
            onDeleteInstitute={deleteInstitute}
          />
          <ChatBot />
        </>
      )}
      
      <footer className="bg-slate-800 text-white py-6 mt-auto text-center no-print">
        <p className="text-sm font-semibold mb-1">جامعة الأزهر - كلية التربية بنين بتفهنا الأشراف</p>
        <p className="text-xs opacity-75">© جميع الحقوق محفوظة باسم (قسم المناهج وطرق التدريس)</p>
      </footer>
    </div>
  );
};

export default App;
