
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // رسالة ترحيبية أولية تظهر في الواجهة فقط ولا تُرسل للمحرك كجزء من التاريخ المبدئي
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        text: 'مرحبًا عزيزي الطالب معلم المستقبل، يسعدني مساعدتك والرد على استفساراتك حول تسجيل التربية العملية.'
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // 1. إضافة رسالة المستخدم للواجهة فوراً
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      /**
       * إصلاح التاريخ (History):
       * Gemini يتطلب أن يبدأ التاريخ برسالة 'user'.
       * رسالتنا الأولى في المصفوفة هي 'model' (الترحيب)، لذا يجب تخطيها عند بناء التاريخ.
       */
      const history = messages
        .filter((m, index) => {
          // تخطي الرسالة الأولى إذا كانت من النوع model لضمان بدء التاريخ بـ user
          if (index === 0 && m.role === 'model') return false;
          return true;
        })
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'أنت مساعد ذكي مخصص لطلاب كلية التربية بنين بتفهنا الأشراف، جامعة الأزهر. مهمتك هي مساعدة الطلاب في الاستفسارات المتعلقة بتسجيل التربية العملية، الشعب الدراسية، والمعاهد. كن ودوداً ومشجعاً ولقبهم دائماً بـ "معلم المستقبل". أجب باللغة العربية الفصحى المبسطة.',
          temperature: 0.7,
        },
        history: history
      });

      const result = await chat.sendMessage({ message: userMessage });
      const aiText = result.text || "عذراً، لم أستطع توليد رد حالياً.";
      
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Gemini Chat Error Details:", error);
      
      // محاولة أخيرة باستخدام generateContent المباشر في حال فشل الجلسة (Stateless Fallback)
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          config: { 
            systemInstruction: 'أجب باختصار شديد كمسؤول دعم في كلية التربية بنين بتفهنا الأشراف.' 
          }
        });
        setMessages(prev => [...prev, { role: 'model', text: fallbackResponse.text || "حدث خطأ في معالجة الرد." }]);
      } catch (fallbackError) {
        setMessages(prev => [...prev, { role: 'model', text: "عذراً يا معلم المستقبل، يبدو أن هناك مشكلة مؤقتة في الاتصال بخوادم الذكاء الاصطناعي. يرجى المحاولة مرة أخرى بعد لحظات." }]);
      }
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
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">متصل الآن للإجابة</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/10 p-2 rounded-xl transition-colors text-indigo-200 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
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
                  <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm font-bold ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
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
                  <div className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-slate-100 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اسألني أي شيء يا معلم المستقبل..."
              className="flex-1 bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 text-sm font-bold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-right"
              dir="rtl"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-600 text-white p-3.5 rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-100 active:scale-95"
            >
              <Send size={22} className="rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        title={isOpen ? "إغلاق المساعد" : "تحدث مع المساعد الذكي"}
      >
        <div className={`absolute inset-0 rounded-full bg-inherit animate-ping opacity-20 ${isOpen ? 'hidden' : ''}`}></div>
        
        {isOpen ? (
          <X size={28} className="text-white" />
        ) : (
          <div className="relative">
            <MessageCircle size={30} className="text-white" />
            <Sparkles size={14} className="text-amber-300 absolute -top-2 -right-2 animate-pulse" />
          </div>
        )}
        
        {!isOpen && (
          <span className="absolute right-20 whitespace-nowrap bg-indigo-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-indigo-800">
            مساعد معلم المستقبل
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
