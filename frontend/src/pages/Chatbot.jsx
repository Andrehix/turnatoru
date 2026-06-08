import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Chatbot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Salut! Sunt asistentul AI al platformei Turnatoru. Te ajut să formulezi feedback mai bine sau să înțelegi răspunsurile primite. Cu ce te pot ajuta?',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setInput(''); setLoading(true); setError('');
    try {
      const payload = newMessages.slice(-20).map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
      const res = await fetch('/agents/chatbot/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: payload }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch { setError('Agentul AI nu e disponibil momentan.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto animate-slideUp">
      <h1 className="text-4xl font-black text-rat-red text-center mb-2">🤖 Asistent AI</h1>
      <p className="text-rat-text-dim text-center mb-8 text-lg">Te ajut să formulezi feedback mai bine sau să înțelegi răspunsurile primite.</p>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
        {/* Messages */}
        <div className="h-[480px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && <span className="text-xl mr-2 mt-1">🤖</span>}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${msg.role === 'user'
                ? 'bg-rat-red text-white rounded-br-md'
                : 'text-rat-text rounded-bl-md'}`}
                style={msg.role === 'assistant' ? { background: 'rgba(255,255,255,0.08)' } : {}}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === 'user' && <span className="text-xl ml-2 mt-1">🐀</span>}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <span className="text-xl mr-2 mt-1">🤖</span>
              <div className="rounded-2xl rounded-bl-md px-5 py-3.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-rat-red rounded-full animate-bounce-dot" />
                  <span className="w-2 h-2 bg-rat-red rounded-full animate-bounce-dot" />
                  <span className="w-2 h-2 bg-rat-red rounded-full animate-bounce-dot" />
                </div>
              </div>
            </div>
          )}
          {error && <div className="text-center py-4"><span className="text-rat-red text-sm">⚠️ {error}</span></div>}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t p-4 flex gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
            placeholder="Scrie mesajul tău... (Enter = trimite)"
            rows={2}
            className="flex-1 px-4 py-3 rounded-xl resize-none focus:outline-none focus:border-rat-red transition-all"
            style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(233,69,96,0.3)', color: '#fff' }}
            disabled={loading} />
          <button type="submit" disabled={loading || !input.trim()}
            className="bg-rat-red hover:bg-rat-red-hover disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold shrink-0 transition-all">
            🚀
          </button>
        </form>
      </div>

      <p className="text-center text-rat-text-muted text-sm mt-4">
        🔒 Conversația nu este salvată pe server. Feedback-ul tău rămâne anonim.
      </p>
    </div>
  );
}
