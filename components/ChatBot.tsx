
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Minus, GripHorizontal, Bot, User } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{startX: number, startY: number, startPosX: number, startPosY: number} | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Initial Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        text: 'مرحبًا عزيزي الطالب معلم المستقبل يسعدني مساعدتك والرد على اسئلتك'
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userMessage }].map(m => ({
          parts: [{ text: m.text }],
          role: m.role
        })),
        config: {
          systemInstruction: 'أنت مساعد ذكي مخصص لطلاب كلية التربية بنين بتفهنا الأشراف، جامعة الأزهر. مهمتك هي مساعدة الطلاب في الاستفسارات المتعلقة بتسجيل التربية العملية، الشعب الدراسية، والمعاهد. كن ودوداً ومشجعاً ولقبهم دائماً بـ "معلم المستقبل". أجب باللغة العربية الفصحى المبسطة.',
          temperature: 0.7,
        },
      });

      const aiText = response.text || "عذراً، لم أستطع فهم ذلك. هل يمكنك المحاولة مرة أخرى؟";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.startPosX + dx,
        y: dragRef.current.startPosY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      className="fixed z-[9999] no-print"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {!isOpen ? (
        <button
          onMouseDown={handleMouseDown}
          onClick={() => !isDragging && setIsOpen(true)}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 group relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          title="مساعد معلم المستقبل"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-indigo-600 animate-pulse"></div>
          <MessageCircle size={28} />
          <span className="absolute right-14 whitespace-nowrap bg-indigo-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">تحدث مع المساعد الذكي</span>
        </button>
      ) : (
        <div className="bg-indigo-50 w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-indigo-200 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div 
            onMouseDown={handleMouseDown}
            className={`bg-indigo-900 p-4 text-white flex justify-between items-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-800 p-2 rounded-lg text-amber-400">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">مساعد معلم المستقبل</h3>
                <p className="text-[10px] text-indigo-300">نظام ذكي لخدمة الطلاب</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-800 p-1 rounded transition">
                <Minus size={18} />
              </button>
              <div className="text-indigo-700">
                <GripHorizontal size={18} />
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div 
            ref={chatWindowRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-indigo-50/50 custom-scrollbar"
            style={{ direction: 'rtl' }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-300 text-slate-700'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-700 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-indigo-100'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-end">
                <div className="flex gap-2 flex-row-reverse items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 animate-pulse">
                    <Bot size={16} />
                  </div>
                  <div className="bg-slate-100 p-3 rounded-2xl border border-indigo-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-indigo-100/50 border-t border-indigo-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب سؤالك هنا يا معلم المستقبل..."
              className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition text-right"
              dir="rtl"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-indigo-800 text-white p-2 rounded-xl hover:bg-indigo-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send size={20} className="rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
