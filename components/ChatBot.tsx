
import { GoogleGenAI } from "@google/genai";
import { Bot, MessageCircle, Send, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        text: 'مرحبًا بك يا معلم المستقبل! أنا مساعدك الذكي في بوابة التربية العملية. كيف يمكنني مساعدتك اليوم؟'
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const currentMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const historyForApi = currentMessages
        .filter((_, idx) => idx > 0) 
        .map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: historyForApi,
        config: {
          systemInstruction: 'أنت مساعد ذكي مخصص لطلاب كلية التربية بنين بتفهنا الأشراف، جامعة الأزهر. لقب الطلاب دائماً بـ "معلم المستقبل". أجب باللغة العربية بأسلوب ودود ومختصر. ساعدهم في فهم كيفية اختيار المعاهد، الفرق بين الفرقة الثالثة والرابعة، وأهمية التربية العملية.',
          temperature: 0.7,
        },
      });

      const aiText = response.text || "عذراً يا معلم المستقبل، لم أستطع معالجة الرد الآن. هل يمكنك صياغة سؤالك بشكل آخر؟";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error: any) {
      console.error("ChatBot Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "عذراً يا معلم المستقبل، واجهت مشكلة في الاتصال. حاول مرة أخرى." 
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
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-emerald-50 animate-in slide-in-from-bottom-10 duration-300 origin-bottom-right">
          <div className="bg-[#055039] p-6 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md">
                <Bot size={24} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-black text-sm">مساعد معلم المستقبل</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] text-emerald-100 font-bold opacity-80 uppercase tracking-widest">متصل</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <div 
            ref={chatWindowRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50"
            style={{ direction: 'rtl' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-[#055039] text-white' : 'bg-white text-slate-500 border border-slate-100'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm font-bold leading-relaxed ${msg.role === 'user' ? 'bg-[#055039] text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="flex gap-3 flex-row-reverse items-center">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 animate-pulse">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-1 shadow-sm">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب هنا..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm font-bold focus:bg-white outline-none transition-all text-right"
              dir="rtl"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-[#055039] text-white p-3 rounded-xl hover:bg-[#064e3b] transition disabled:opacity-50 active:scale-95"
            >
              <Send size={20} className="rotate-180" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 hover:scale-110 group ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-[#055039]'}`}
      >
        {isOpen ? <X size={28} className="text-white" /> : <MessageCircle size={30} className="text-white" />}
      </button>
    </div>
  );
};

export default ChatBot;
