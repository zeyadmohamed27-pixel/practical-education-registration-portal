
import React, { useRef } from 'react';
import { Institute, Student } from '../types';
import { Printer, X, Download, FileText } from 'lucide-react';

interface LetterGeneratorProps {
  institute: Institute;
  students: Student[];
  onClose: () => void;
}

const LetterGenerator: React.FC<LetterGeneratorProps> = ({ institute, students, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ar-EG');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 no-print-backdrop">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Toolbar */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-50 no-print">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <FileText size={20} className="text-sky-700" />
            استعراض خطاب التوجيه
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-800 transition shadow-sm"
            >
              <Printer size={18} />
              طباعة
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Letter Preview Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div 
            ref={printRef}
            className="bg-white w-full mx-auto p-12 shadow-lg min-h-[29.7cm] print:shadow-none print:p-8 print:m-0 print:w-full"
            style={{ direction: 'rtl' }}
          >
            {/* Header Logos & Univ Info */}
            <div className="flex justify-between items-center mb-10 border-b-2 border-slate-800 pb-6">
              <div className="text-right flex-1">
                <p className="font-bold text-lg">الأزهر الشريف</p>
                <p className="font-semibold">جامعة الأزهر</p>
                <p className="font-semibold text-sm">كلية التربية بنين بتفهنا الأشراف</p>
                <p className="text-xs">قسم المناهج وطرق التدريس</p>
              </div>
              <div className="text-center flex-1">
                <img 
                  src="./logo.png" 
                  alt="وحدة التربية العملية" 
                  className="w-32 h-32 mx-auto object-contain" 
                />
              </div>
              <div className="text-left flex-1 text-sm">
                <p>التاريخ: {currentDate}</p>
                <p>الرقم السري: TR-2025-{institute.id.split('-')[0]}</p>
                <p>الموضوع: التربية العملية</p>
              </div>
            </div>

            {/* Letter Body */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black underline underline-offset-8">خطاب توجيه طلاب التربية العملية</h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed mb-10">
              <p className="font-bold">السيد صاحب الفضيلة/ شيخ {institute.name}</p>
              <p className="font-semibold">تحية طيبة وبعد ،،،</p>
              <p>
                يرجى التفضل بالموافقة على تدريب السادة الطلاب الواردة أسماؤهم أدناه بعهدكم الموقر، وذلك لإتمام مقرر (التربية العملية) لطلاب {institute.year === 'third' ? 'الفرقة الثالثة' : 'الفرقة الرابعة'} للعام الجامعي 2024/2025.
              </p>
              <p>
                نرجو من فضيلتكم تمكينهم من ممارسة التدريس الفعلي تحت إشراف شيخ المعهد وموجه المادة، وموافقتنا بتقرير دوري عن انتظامهم وتفوقهم في أداء مهامهم.
              </p>
            </div>

            {/* Students Table */}
            <div className="mb-10">
              <table className="w-full border-collapse border-2 border-slate-800">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border-2 border-slate-800 p-2 text-center w-12">م</th>
                    <th className="border-2 border-slate-800 p-2 text-right">اسم الطالب رباعياً</th>
                    <th className="border-2 border-slate-800 p-2 text-center w-48">الرقم القومي (14 رقم)</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id}>
                      <td className="border-2 border-slate-800 p-2 text-center">{index + 1}</td>
                      <td className="border-2 border-slate-800 p-2 text-right font-semibold">{student.name}</td>
                      <td className="border-2 border-slate-800 p-2 text-center font-mono">{student.nationalId}</td>
                    </tr>
                  ))}
                  {/* Empty rows to reach 6 if needed */}
                  {[...Array(Math.max(0, 6 - students.length))].map((_, i) => (
                    <tr key={`empty-${i}`} className="h-10 opacity-30">
                      <td className="border-2 border-slate-800 p-2 text-center">{students.length + i + 1}</td>
                      <td className="border-2 border-slate-800 p-2 text-right">..............................................</td>
                      <td className="border-2 border-slate-800 p-2 text-center">.....................</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-20 mt-20">
              <div className="text-center">
                <p className="font-bold mb-12">منسق التربية العملية</p>
                <p className="font-semibold">................................</p>
              </div>
              <div className="text-center">
                <p className="font-bold mb-12">رئيس قسم المناهج وطرق التدريس</p>
                <p className="font-semibold underline">أ.د/ ................................</p>
              </div>
            </div>

            <div className="mt-auto pt-10 text-xs text-slate-400 text-center border-t border-slate-100">
              <p>تفهنا الأشراف - مركز ميت غمر - الدقهلية | كلية التربية بنين</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterGenerator;
