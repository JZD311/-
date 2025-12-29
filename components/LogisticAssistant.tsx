
import React, { useState } from 'react';
import { WorkOrder } from '../types';
import { BrainCircuit, Loader2, Sparkles, MapPin } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface LogisticAssistantProps {
  workOrders: WorkOrder[];
}

const LogisticAssistant: React.FC<LogisticAssistantProps> = ({ workOrders }) => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const analyzeLogistics = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const ordersSummary = workOrders.map(wo => ({
        number: wo.number,
        addresses: wo.tasks.map(t => t.address),
        load: wo.tasks.length
      }));

      const prompt = `Analyze the following work orders for logistic efficiency. Identify if tasks are geographically clustered or if there are outliers.
      Data: ${JSON.stringify(ordersSummary)}
      
      Requirements:
      1. Keep it short (max 3 sentences).
      2. Suggest which order is best for a new task in a specific neighborhood if you see patterns.
      3. Language: Russian.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAdvice(response.text || "Не удалось проанализировать данные.");
    } catch (err) {
      console.error(err);
      setAdvice("Ошибка подключения к ИИ-ассистенту.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-blue-100 shadow-sm animate-in slide-in-from-top duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Логистический ИИ-ассистент</h4>
            <p className="text-xs text-slate-400">Анализ географии и нагрузки текущих нарядов</p>
          </div>
        </div>
        {!advice && !loading && (
          <button 
            onClick={analyzeLogistics}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-blue-600 font-bold px-4 py-2 rounded-xl transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Проанализировать
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {advice && !loading && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 text-blue-900 text-sm leading-relaxed rounded-2xl italic">
            "{advice}"
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => { setAdvice(null); analyzeLogistics(); }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Обновить анализ
            </button>
          </div>
        </div>
      )}

      {!loading && !advice && (
        <div className="flex gap-2">
          {workOrders.length > 0 ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>Готов проанализировать <b>{workOrders.length}</b> активных нарядов</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">Наряды на сегодня отсутствуют.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default LogisticAssistant;
