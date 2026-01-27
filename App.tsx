
import React, { useState, useEffect } from 'react';
import { User, Institute, Student } from './types';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import { INITIAL_INSTITUTES } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [institutes, setInstitutes] = useState<Institute[]>(INITIAL_INSTITUTES);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedInstitutes = localStorage.getItem('institutes');
    if (savedInstitutes) setInstitutes(JSON.parse(savedInstitutes));

    const savedStudents = localStorage.getItem('students');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
  }, []);

  const handleLogin = (username: string, nationalId: string) => {
    const newUser: User = { username, role: 'student' }; // Role can be dynamic or admin if needed
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const registerStudent = (student: Student) => {
    const updatedInstitutes = institutes.map(inst => {
      if (inst.id === student.instituteId) {
        if (inst.currentCount >= inst.maxCapacity) {
          alert("عذراً، هذا المعهد قد اكتمل عدده (6 طلاب)");
          return inst;
        }
        return { ...inst, currentCount: inst.currentCount + 1 };
      }
      return inst;
    });

    const newStudents = [...students, student];
    setStudents(newStudents);
    setInstitutes(updatedInstitutes);
    
    localStorage.setItem('students', JSON.stringify(newStudents));
    localStorage.setItem('institutes', JSON.stringify(updatedInstitutes));
  };

  const removeStudent = (studentId: string, instituteId: string) => {
    const updatedStudents = students.filter(s => s.id !== studentId);
    const updatedInstitutes = institutes.map(inst => 
      inst.id === instituteId 
        ? { ...inst, currentCount: Math.max(0, inst.currentCount - 1) }
        : inst
    );

    setStudents(updatedStudents);
    setInstitutes(updatedInstitutes);

    localStorage.setItem('students', JSON.stringify(updatedStudents));
    localStorage.setItem('institutes', JSON.stringify(updatedInstitutes));
  };

  const addInstitute = (newInst: Omit<Institute, 'id' | 'currentCount'>) => {
    const id = `${newInst.year}-${newInst.departmentId}-${Date.now()}`;
    const institute: Institute = { ...newInst, id, currentCount: 0 };
    const updated = [institute, ...institutes];
    setInstitutes(updated);
    localStorage.setItem('institutes', JSON.stringify(updated));
  };

  const updateInstitute = (id: string, newName: string) => {
    const updated = institutes.map(inst => inst.id === id ? { ...inst, name: newName } : inst);
    setInstitutes(updated);
    localStorage.setItem('institutes', JSON.stringify(updated));
  };

  const deleteInstitute = (id: string) => {
    const studentsInInst = students.filter(s => s.instituteId === id);
    if (studentsInInst.length > 0) {
      const confirmDelete = window.confirm(`هذا المعهد يحتوي على ${studentsInInst.length} طلاب مسجلين. هل أنت متأكد من حذفه وحذف سجلات الطلاب التابعة له؟`);
      if (!confirmDelete) return;
      
      const remainingStudents = students.filter(s => s.instituteId !== id);
      setStudents(remainingStudents);
      localStorage.setItem('students', JSON.stringify(remainingStudents));
    }

    const updated = institutes.filter(inst => inst.id !== id);
    setInstitutes(updated);
    localStorage.setItem('institutes', JSON.stringify(updated));
  };

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
