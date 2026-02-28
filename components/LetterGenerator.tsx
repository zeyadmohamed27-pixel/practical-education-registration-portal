
import React, { useRef, useState } from 'react';
import { Institute, Student } from '../types';
import { Printer, X, FileText, Edit3, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface LetterGeneratorProps {
  institute: Institute;
  students: Student[];
  onClose: () => void;
}

const LetterGenerator: React.FC<LetterGeneratorProps> = ({ institute, students, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  // Editable states
  const [headerRight, setHeaderRight] = useState({
    line1: "الأزهر الشريف",
    line2: "جامعة الأزهر",
    line3: "كلية التربية بنين بتفهنا الأشراف",
    line4: "قسم المناهج وطرق التدريس"
  });
  
  const [letterTitle, setLetterTitle] = useState("خطاب توجيه طلاب التربية العملية");
  
  const [letterBody, setLetterBody] = useState({
    salutation: `السيد صاحب الفضيلة/ شيخ ${institute.name}`,
    greeting: "تحية طيبة وبعد ،،،",
    content1: `يرجى التفضل بالموافقة على تدريب السادة الطلاب الواردة أسماؤهم أدناه بعهدكم الموقر، وذلك لإتمام مقرر (التربية العملية) لطلاب ${institute.year === 'third' ? 'الفرقة الثالثة' : 'الفرقة الرابعة'} للعام الجامعي 2024/2025.`,
    content2: "نرجو من فضيلتكم تمكينهم من ممارسة التدريس الفعلي تحت إشراف شيخ المعهد وموجه المادة، وموافقتنا بتقرير دوري عن انتظامهم وتفوقهم في أداء مهامهم."
  });

  const [signatures, setSignatures] = useState({
    leftTitle: "رئيس وحدة التربية العملية",
    leftName: "د/................................",
    middleTitle: "رئيس القسم",
    middleName: "أ.د/ ................................",
    rightTitle: "عميد الكلية",
    rightName: "أ.د/ ................................"
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`خطاب_توجيه_${institute.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء تحميل الملف. يرجى المحاولة مرة أخرى.');
    }
  };

  const currentDate = new Date().toLocaleDateString('ar-EG');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 no-print-backdrop">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Toolbar */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-50 no-print">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-sky-700" />
              استعراض خطاب التوجيه
            </h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center gap-1">
              <Edit3 size={12} />
              قابل للتعديل
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm"
            >
              <Download size={18} />
              تحميل PDF
            </button>
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
            <div className="flex justify-between items-start mb-6 border-b-2 border-slate-800 pb-4">
              <div className="text-right w-1/3 space-y-1">
                <input 
                  value={headerRight.line1} 
                  onChange={e => setHeaderRight({...headerRight, line1: e.target.value})}
                  className="font-bold text-lg w-full bg-transparent border-none p-0 focus:ring-0"
                />
                <input 
                  value={headerRight.line2} 
                  onChange={e => setHeaderRight({...headerRight, line2: e.target.value})}
                  className="font-semibold w-full bg-transparent border-none p-0 focus:ring-0"
                />
                <input 
                  value={headerRight.line3} 
                  onChange={e => setHeaderRight({...headerRight, line3: e.target.value})}
                  className="font-semibold text-sm w-full bg-transparent border-none p-0 focus:ring-0"
                />
                <input 
                  value={headerRight.line4} 
                  onChange={e => setHeaderRight({...headerRight, line4: e.target.value})}
                  className="text-xs w-full bg-transparent border-none p-0 focus:ring-0"
                />
              </div>
              
              {/* New Centered Logo Strip */}
              <div className="flex-1 px-4 flex justify-center self-center">
                <img 
                  src="https://lh3.googleusercontent.com/d/1vtJXcW6lPdL7bEqhWDJ0LfaieeSk_Rt6" 
                  alt="Logos Strip" 
                  className="h-24 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x120?text=Logos+Strip";
                  }}
                />
              </div>

              <div className="text-left w-1/3 text-sm pt-1 space-y-1">
                <p>التاريخ: {currentDate}</p>
                <p>الرقم السري: TR-2025-{institute.id.split('-')[0]}</p>
                <p>الموضوع: التربية العملية</p>
              </div>
            </div>

            {/* Letter Body */}
            <div className="text-center mb-10">
              <input 
                value={letterTitle}
                onChange={e => setLetterTitle(e.target.value)}
                className="text-2xl font-black underline underline-offset-8 text-center w-full bg-transparent border-none p-0 focus:ring-0"
              />
            </div>

            <div className="space-y-6 text-lg leading-relaxed mb-10">
              <input 
                value={letterBody.salutation}
                onChange={e => setLetterBody({...letterBody, salutation: e.target.value})}
                className="font-bold w-full bg-transparent border-none p-0 focus:ring-0"
              />
              <input 
                value={letterBody.greeting}
                onChange={e => setLetterBody({...letterBody, greeting: e.target.value})}
                className="font-semibold w-full bg-transparent border-none p-0 focus:ring-0"
              />
              <textarea 
                value={letterBody.content1}
                onChange={e => setLetterBody({...letterBody, content1: e.target.value})}
                className="w-full bg-transparent border-none p-0 focus:ring-0 resize-none overflow-hidden"
                rows={2}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
              <textarea 
                value={letterBody.content2}
                onChange={e => setLetterBody({...letterBody, content2: e.target.value})}
                className="w-full bg-transparent border-none p-0 focus:ring-0 resize-none overflow-hidden"
                rows={2}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
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
            <div className="grid grid-cols-3 gap-10 mt-20">
              <div className="text-center space-y-12">
                <input 
                  value={signatures.leftTitle}
                  onChange={e => setSignatures({...signatures, leftTitle: e.target.value})}
                  className="font-bold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                />
                <input 
                  value={signatures.leftName}
                  onChange={e => setSignatures({...signatures, leftName: e.target.value})}
                  className="font-semibold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                />
              </div>
              <div className="text-center space-y-12">
                <input 
                  value={signatures.middleTitle}
                  onChange={e => setSignatures({...signatures, middleTitle: e.target.value})}
                  className="font-bold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                />
                <input 
                  value={signatures.middleName}
                  onChange={e => setSignatures({...signatures, middleName: e.target.value})}
                  className="font-semibold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                />
              </div>
              <div className="text-center space-y-12">
                <input 
                  value={signatures.rightTitle}
                  onChange={e => setSignatures({...signatures, rightTitle: e.target.value})}
                  className="font-bold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                />
                <input 
                  value={signatures.rightName}
                  onChange={e => setSignatures({...signatures, rightName: e.target.value})}
                  className="font-semibold underline text-center w-full bg-transparent border-none p-0 focus:ring-0"
                />
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
