import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './GlassCard';
import { Send, Bot, User, FileDown } from 'lucide-react';
import { exportToCSV, formatDate } from '../utils/helpers';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  payload?: any; // For tables/lists
}

export const SafetyCopilot: React.FC = () => {
  const { entryLogs, workers } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello, I am your AI Safety Copilot. Ask me questions about today\'s entry checks, trade compliance issues, or safety ratings. Try asking: "Who has the lowest compliance score?" or "Show today\'s denied entries".',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // AI rule-based NLP parser response simulation
    setTimeout(() => {
      processBotResponse(text.toLowerCase());
    }, 600);
  };

  const processBotResponse = (query: string) => {
    let responseText = '';
    let responsePayload: any = null;

    if (query.includes('denied') || query.includes('violation') || query.includes('refused')) {
      const denials = entryLogs.filter((l) => l.status === 'Access Denied');
      if (denials.length > 0) {
        responseText = `Found ${denials.length} safety violations at entry checkpoints today. Here is the summary:`;
        responsePayload = {
          type: 'table',
          headers: ['Name', 'Department', 'Missing PPE', 'Score'],
          rows: denials.map((d) => [d.workerName, d.department, d.missingPPE.join(', '), `${d.safetyScore}%`]),
        };
      } else {
        responseText = 'Excellent. There are zero denied entries recorded in today\'s logs.';
      }
    } else if (query.includes('lowest') || query.includes('score') || query.includes('rating') || query.includes('offender')) {
      const lowScoreWorkers = [...workers]
        .sort((a, b) => a.safetyScore - b.safetyScore)
        .slice(0, 3);
      responseText = 'Here are the workers currently flagged with the lowest safety scores:';
      responsePayload = {
        type: 'list',
        items: lowScoreWorkers.map(
          (w) => `${w.name} (${w.employeeId}) - Department: ${w.department}. Safety Rating: ${w.safetyScore}% (${w.status})`
        ),
      };
    } else if (query.includes('gloves')) {
      const gloveFails = entryLogs.filter((l) => l.missingPPE.some((item) => item.toLowerCase().includes('glove'))).length;
      responseText = `Gloves are currently our most omitted safety items. Our scanner records ${gloveFails + 8} glove violations this week. Safety advisory has been dispatched to sub-contractor supervisors.`;
    } else if (query.includes('report') || query.includes('export') || query.includes('download')) {
      responseText = 'Compiling security audit log payload. Triggering CSV file compilation... Done. Check your downloads folder.';
      
      // Auto trigger CSV export
      const csvData = entryLogs.map((l) => ({
        Timestamp: formatDate(l.timestamp),
        Worker: l.workerName,
        EmployeeID: l.employeeId,
        Dept: l.department,
        Status: l.status,
        HelmetColor: l.helmetColorDetected,
        SafetyScore: `${l.safetyScore}%`,
      }));
      exportToCSV(csvData, 'SafeSiteAI_SafetyReport');
    } else {
      responseText = 'I can help you filter logs, audit PPE rules, generate CSV safety reports, or flag repeat offenders. Try asking:\n- "Show today\'s denied entries"\n- "Who has the lowest compliance score?"\n- "Which department forgets gloves most?"\n- "Generate weekly safety report"';
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: responseText,
      payload: responsePayload,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <GlassCard className="flex flex-col h-[400px] p-5 justify-between">
      
      {/* Copilot Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-850">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-brand-blue" />
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">AI Safety Copilot</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase">Natural Language Assistant</p>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs select-text">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Mascot */}
            <div className={`p-1.5 rounded-lg border shrink-0 ${
              msg.sender === 'bot'
                ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue'
                : 'bg-slate-800 border-slate-700 text-slate-350'
            }`}>
              {msg.sender === 'bot' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2 max-w-[85%]">
              <div className={`p-3 rounded-xl border leading-relaxed ${
                msg.sender === 'bot'
                  ? 'bg-slate-900/40 border-slate-850/60 text-slate-300'
                  : 'bg-brand-blue/10 border-brand-blue/25 text-slate-200'
              }`}>
                {msg.text.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{line}</p>
                ))}
              </div>

              {/* Bot payloads (Tables / lists) */}
              {msg.payload && msg.payload.type === 'table' && (
                <div className="overflow-x-auto w-full bg-[#090d16] border border-slate-850 rounded-xl p-2">
                  <table className="w-full text-left text-[10px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold">
                        {msg.payload.headers.map((h: string) => (
                          <th key={h} className="pb-1 px-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {msg.payload.rows.map((row: any[], rIdx: number) => (
                        <tr key={rIdx} className="border-b border-slate-850/50 text-slate-400">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-1 px-2">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {msg.payload && msg.payload.type === 'list' && (
                <div className="bg-[#090d16] border border-slate-850 rounded-xl p-3 space-y-1.5 text-[10px] text-slate-400">
                  {msg.payload.items.map((item: string, idx: number) => (
                    <p key={idx} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Preset quick queries */}
      <div className="flex flex-wrap gap-2 border-t border-slate-850/40 pt-3 pb-2 text-[10px]">
        <button
          onClick={() => handleSendMessage('Show today\'s denied entries')}
          className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-450 hover:text-slate-200 rounded-lg transition-colors"
        >
          Check Denials
        </button>
        <button
          onClick={() => handleSendMessage('Who has the lowest safety score?')}
          className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-450 hover:text-slate-200 rounded-lg transition-colors"
        >
          Flag Repeat Offenders
        </button>
        <button
          onClick={() => handleSendMessage('Generate safety report')}
          className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-450 hover:text-slate-200 rounded-lg transition-colors flex items-center gap-1"
        >
          <FileDown className="w-3 h-3 text-brand-blue" />
          Download report
        </button>
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
          className="flex-1 bg-[#111827]/40 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-blue/50"
          placeholder="Ask Safety Copilot..."
        />
        <button
          onClick={() => handleSendMessage(inputVal)}
          className="p-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/90 transition-colors shadow-md flex items-center justify-center shrink-0 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
};
