
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // رسالة ترحيبية أولية تظهر في الواجهة فقط
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        text: 'مرحبًا يا معلم المستقبل، أنا مساعدك الذكي في كلية التربية. كيف يمكنني مساعدتك اليوم في تسجيل التربية العملية؟'
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // إضافة رسالة المستخدم للواجهة
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      /**
       * بناء مصفوفة المحتويات (Contents) لمحرك Gemini:
       * 1. يجب أن تبدأ بـ 'user'.
       * 2. يجب أن تتبادل الأدوار (user -> model -> user).
       * لذا سنقوم بتخطي رسالة الترحيب (index 0) لأنها 'model'.
       */
      const apiContents = [];
      
      // نبدأ من الرسائل التي تلت رسالة الترحيب
      for (let i = 1; i < messages.length; i++) {
        apiContents.push({
          role: messages[i].role,
          parts: [{ text: messages[i].text }]
        });
      }

      // إضافة الرسالة الحالية للمستخدم
      apiContents.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      // إرسال الطلب للمحرك
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: apiContents,
        config: {
          systemInstruction: 'أنت مساعد ذكي مخصص لطلاب كلية التربية بنين بتفهنا الأشراف، جامعة الأزهر. لقب الطلاب بـ "معلم المستقبل". ساعدهم في استفسارات التربية العملية والشعب والمعاهد. كن ودوداً ومختصراً وأجب بالعربية.',
          temperature: 0.7,
        }
      });

      const aiText = result.text || "عذراً يا معلم المستقبل، لم أستطع فهم الطلب حالياً.";
      
      // إضافة رد البوت للواجهة
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "عذراً يا معلم المستقبل، حدث خطأ تقني بسيط في الاتصال. يرجى المحاولة مرة أخرى أو التأكد من استقرار الإنترنت لديك." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] no-print flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-indigo-100 animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-indigo-900 p-6 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-800/50 p-2.5 rounded-2xl text-amber-400 backdrop-blur-sm border border-indigo-700">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-tight">مساعد معلم المستقبل</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">متصل الآن</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors text-indigo-200">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatWindowRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white custom-scrollbar"
            style={{ direction: 'rtl' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`mt-1 flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`p-4 rounded-3xl text-sm font-bold shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="flex gap-3 flex-row-reverse items-center">
                  <div className="w-9 h-9 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 animate-pulse">
                    <Bot size={18} />
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-5 bg-white border-t border-slate-100 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب استفسارك هنا..."
              className="flex-1 bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-right"
              dir="rtl"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 text-white p-3.5 rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg active:scale-95"
            >
              <Send size={22} className="rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 hover:scale-110 group relative ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-indigo-600'}`}
      >
        {!isOpen && <div className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-20"></div>}
        {isOpen ? <X size={28} className="text-white" /> : <MessageCircle size={30} className="text-white" />}
        {!isOpen && (
          <span className="absolute right-20 whitespace-nowrap bg-indigo-900 text-white text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
            مساعد معلم المستقبل
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
