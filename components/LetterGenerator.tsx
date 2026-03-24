
import React, { useRef, useState, useEffect } from 'react';
import { Institute, Student } from '../types';
import { Printer, X, FileText, Edit3, Download, Save, Check } from 'lucide-react';
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
    line1: "جامعة الأزهر",
    line2: "كلية التربية بنين بتفهنا الأشراف",
    line3: "قسم المناهج وطرق التدريس",
    line4: "  وحدة التربية العملية "

  });
  
  const [letterTitle, setLetterTitle] = useState("خطاب توجيه طلاب التربية العملية");
  
  const [letterBody, setLetterBody] = useState({
    salutation: `السيد صاحب الفضيلة/ شيخ ${institute.name}`,
    greeting: "تحية طيبة وبعد ،،،",
    content1: `يرجى التفضل بالموافقة على تدريب السادة الطلاب الواردة أسماؤهم أدناه بعهدكم الموقر، وذلك لإتمام مقرر (التربية العملية) لطلاب ${institute.year === 'third' ? 'الفرقة الثالثة' : 'الفرقة الرابعة'} للعام الجامعي 2025/2026.`,
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

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem(`letter_config_${institute.id}`);
    if (savedData) {
      try {
        const config = JSON.parse(savedData);
        if (config.headerRight) setHeaderRight(config.headerRight);
        if (config.letterTitle) setLetterTitle(config.letterTitle);
        if (config.letterBody) setLetterBody(config.letterBody);
        if (config.signatures) setSignatures(config.signatures);
      } catch (e) {
        console.error("Error loading saved letter config", e);
      }
    }
  }, [institute.id]);

  const handleSave = () => {
    setIsSaving(true);
    const config = {
      headerRight,
      letterTitle,
      letterBody,
      signatures
    };
    localStorage.setItem(`letter_config_${institute.id}`, JSON.stringify(config));
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 600);
  };
  
  const handlePrint = async () => {
    setIsGenerating(true);
    // Small delay to allow UI to update (replace inputs with text)
    await new Promise(resolve => setTimeout(resolve, 100));
    window.print();
    setIsGenerating(false);
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    
    setIsGenerating(true);
    // Small delay to allow UI to update (replace inputs with text)
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const element = printRef.current;
      // Use a higher scale for better quality
      const canvas = await html2canvas(element, {
        scale: 4,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        // Removing windowWidth/Height to let html2canvas handle full element capture
        onclone: (clonedDoc) => {
          // Ensure the cloned element is fully visible for capture
          const clonedElement = clonedDoc.querySelector('[data-print-container="true"]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.height = 'auto';
            clonedElement.style.overflow = 'visible';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit A4 while maintaining aspect ratio
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      
      let finalWidth = pdfWidth;
      let finalHeight = pdfWidth / ratio;
      
      // If height exceeds A4, scale down to fit height
      if (finalHeight > pdfHeight) {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * ratio;
      }
      
      // Center horizontally
      const xOffset = (pdfWidth - finalWidth) / 2;
      
      pdf.addImage(imgData, 'JPEG', xOffset, 0, finalWidth, finalHeight);
      pdf.save(`خطاب_توجيه_${institute.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء تحميل الملف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
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
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition shadow-sm ${showSaveSuccess ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
            >
              {isSaving ? (
                <div className="animate-spin h-4 w-4 border-2 border-slate-600 border-t-transparent rounded-full" />
              ) : showSaveSuccess ? (
                <Check size={18} />
              ) : (
                <Save size={18} />
              )}
              {showSaveSuccess ? 'تم الحفظ' : 'حفظ التعديلات'}
            </button>
            <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition shadow-sm ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  جاري التحميل...
                </>
              ) : (
                <>
                  <Download size={18} />
                  تحميل PDF
                </>
              )}
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
            data-print-container="true"
            className="bg-white w-full mx-auto p-12 shadow-lg min-h-[29.7cm] print:shadow-none print:p-8 print:m-0 print:w-full flex flex-col"
            style={{ direction: 'rtl', textAlign: 'right' }}
          >
            {/* Header Logos & Univ Info */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-slate-800 pb-4">
              <div className="text-right w-1/3 space-y-1">
                {isGenerating ? (
                  <div className="font-bold text-lg">{headerRight.line1}</div>
                ) : (
                  <input 
                    value={headerRight.line1} 
                    onChange={e => setHeaderRight({...headerRight, line1: e.target.value})}
                    className="font-bold text-lg w-full bg-transparent border-none p-0 focus:ring-0"
                  />
                )}
                {isGenerating ? (
                  <div className="font-semibold">{headerRight.line2}</div>
                ) : (
                  <input 
                    value={headerRight.line2} 
                    onChange={e => setHeaderRight({...headerRight, line2: e.target.value})}
                    className="font-semibold w-full bg-transparent border-none p-0 focus:ring-0"
                  />
                )}
                {isGenerating ? (
                  <div className="font-semibold text-sm">{headerRight.line3}</div>
                ) : (
                  <input 
                    value={headerRight.line3} 
                    onChange={e => setHeaderRight({...headerRight, line3: e.target.value})}
                    className="font-semibold text-sm w-full bg-transparent border-none p-0 focus:ring-0"
                  />
                )}
                {isGenerating ? (
                  <div className="text-xs">{headerRight.line4}</div>
                ) : (
                  <input 
                    value={headerRight.line4} 
                    onChange={e => setHeaderRight({...headerRight, line4: e.target.value})}
                    className="text-xs w-full bg-transparent border-none p-0 focus:ring-0"
                  />
                )}
              </div>
              
              {/* New Centered Logo Strip */}
              <div className="flex-1 px-4 flex justify-center self-center">
                <img 
                  src="https://lh3.googleusercontent.com/d/1vtJXcW6lPdL7bEqhWDJ0LfaieeSk_Rt6" 
                  alt="Logos Strip" 
                  className="h-32 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x160?text=Logos+Strip";
                  }}
                />
              </div>

              <div className="text-left w-1/3 text-sm pt-1 space-y-1" style={{ direction: 'ltr' }}>
                <p>التاريخ: {currentDate}</p>
                <p>الرقم السري: TR-2025-{institute.id.split('-')[0]}</p>
                <p>الموضوع: التربية العملية</p>
              </div>
            </div>

            {/* Letter Body */}
            <div className="text-center mb-10">
              {isGenerating ? (
                <div className="text-2xl font-black underline underline-offset-8 text-center">{letterTitle}</div>
              ) : (
                <input 
                  value={letterTitle}
                  onChange={e => setLetterTitle(e.target.value)}
                  className="text-2xl font-black underline underline-offset-8 text-center w-full bg-transparent border-none p-0 focus:ring-0"
                />
              )}
            </div>

            <div className="space-y-6 text-lg leading-relaxed mb-10 text-right" style={{ textAlign: 'right' }}>
              {isGenerating ? (
                <div className="font-bold" style={{ textAlign: 'right' }}>{letterBody.salutation}</div>
              ) : (
                <input 
                  value={letterBody.salutation}
                  onChange={e => setLetterBody({...letterBody, salutation: e.target.value})}
                  className="font-bold w-full bg-transparent border-none p-0 focus:ring-0 text-right"
                  style={{ textAlign: 'right' }}
                />
              )}
              {isGenerating ? (
                <div className="font-semibold" style={{ textAlign: 'right' }}>{letterBody.greeting}</div>
              ) : (
                <input 
                  value={letterBody.greeting}
                  onChange={e => setLetterBody({...letterBody, greeting: e.target.value})}
                  className="font-semibold w-full bg-transparent border-none p-0 focus:ring-0 text-right"
                  style={{ textAlign: 'right' }}
                />
              )}
              {isGenerating ? (
                <div className="whitespace-pre-wrap" style={{ textAlign: 'right' }}>{letterBody.content1}</div>
              ) : (
                <textarea 
                  value={letterBody.content1}
                  onChange={e => setLetterBody({...letterBody, content1: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 resize-none overflow-hidden text-right"
                  style={{ textAlign: 'right' }}
                  rows={2}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              )}
              {isGenerating ? (
                <div className="whitespace-pre-wrap" style={{ textAlign: 'right' }}>{letterBody.content2}</div>
              ) : (
                <textarea 
                  value={letterBody.content2}
                  onChange={e => setLetterBody({...letterBody, content2: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 resize-none overflow-hidden text-right"
                  style={{ textAlign: 'right' }}
                  rows={2}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              )}
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
            <div className="grid grid-cols-3 gap-10 mt-auto pt-10" style={{ textAlign: 'center' }}>
              <div className="text-center space-y-12" style={{ textAlign: 'center' }}>
                {isGenerating ? (
                  <div className="font-bold" style={{ textAlign: 'center' }}>{signatures.leftTitle}</div>
                ) : (
                  <input 
                    value={signatures.leftTitle}
                    onChange={e => setSignatures({...signatures, leftTitle: e.target.value})}
                    className="font-bold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                    style={{ textAlign: 'center' }}
                  />
                )}
                {isGenerating ? (
                  <div className="font-semibold" style={{ textAlign: 'center' }}>{signatures.leftName}</div>
                ) : (
                  <input 
                    value={signatures.leftName}
                    onChange={e => setSignatures({...signatures, leftName: e.target.value})}
                    className="font-semibold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                    style={{ textAlign: 'center' }}
                  />
                )}
              </div>
              <div className="text-center space-y-12" style={{ textAlign: 'center' }}>
                {isGenerating ? (
                  <div className="font-bold" style={{ textAlign: 'center' }}>{signatures.middleTitle}</div>
                ) : (
                  <input 
                    value={signatures.middleTitle}
                    onChange={e => setSignatures({...signatures, middleTitle: e.target.value})}
                    className="font-bold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                    style={{ textAlign: 'center' }}
                  />
                )}
                {isGenerating ? (
                  <div className="font-semibold" style={{ textAlign: 'center' }}>{signatures.middleName}</div>
                ) : (
                  <input 
                    value={signatures.middleName}
                    onChange={e => setSignatures({...signatures, middleName: e.target.value})}
                    className="font-semibold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                    style={{ textAlign: 'center' }}
                  />
                )}
              </div>
              <div className="text-center space-y-12" style={{ textAlign: 'center' }}>
                {isGenerating ? (
                  <div className="font-bold" style={{ textAlign: 'center' }}>{signatures.rightTitle}</div>
                ) : (
                  <input 
                    value={signatures.rightTitle}
                    onChange={e => setSignatures({...signatures, rightTitle: e.target.value})}
                    className="font-bold text-center w-full bg-transparent border-none p-0 focus:ring-0"
                    style={{ textAlign: 'center' }}
                  />
                )}
                {isGenerating ? (
                  <div className="font-semibold underline" style={{ textAlign: 'center' }}>{signatures.rightName}</div>
                ) : (
                  <input 
                    value={signatures.rightName}
                    onChange={e => setSignatures({...signatures, rightName: e.target.value})}
                    className="font-semibold underline text-center w-full bg-transparent border-none p-0 focus:ring-0"
                    style={{ textAlign: 'center' }}
                  />
                )}
              </div>
            </div>

            <div className="mt-auto pt-10 text-xs text-slate-400 text-center border-t border-slate-100 no-print">
              <p>تفهنا الأشراف - مركز ميت غمر - الدقهلية | كلية التربية بنين</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterGenerator;
