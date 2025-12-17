import { useState, useRef, useEffect } from 'react';


interface OpenMeteoResponse {
  latitude?: number;
  longitude?: number;
  current_weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time?: string;
  };
  [key: string]: any; 
}

interface ChatbotProps {
  data: OpenMeteoResponse | null;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}


const ChatbotUI = ({ data }: ChatbotProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Variables de Entorno
  const API_KEY = import.meta.env.VITE_COHERE_API_KEY;
  const MAX_PROMPTS = Number(import.meta.env.VITE_MAX_PROMPTS_PER_MINUTE) || 5;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeWindow = 60000; 
    
    const historyString = localStorage.getItem('chat_limit_history');
    let timestamps: number[] = historyString ? JSON.parse(historyString) : [];

    timestamps = timestamps.filter(time => (now - time) < timeWindow);

    if (timestamps.length >= MAX_PROMPTS) {
      const secondsLeft = Math.ceil((timeWindow - (now - timestamps[0])) / 1000);
      setErrorMsg(`⚠️ Límite alcanzado. Espera ${secondsLeft} segundos.`);
      return false; 
    }

    timestamps.push(now);
    localStorage.setItem('chat_limit_history', JSON.stringify(timestamps));
    return true;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setErrorMsg(null);
    if (!checkRateLimit()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let systemPrompt = `Eres el asistente virtual de la agencia de viajes "OserTravel". Eres amable, profesional y experto en turismo en Ecuador.`;
    
    if (data && data.current_weather) {
      systemPrompt += `
      \n[DATOS EN TIEMPO REAL]
      El usuario está consultando desde una ubicación con este clima:
      - Temperatura: ${data.current_weather.temperature}°C
      - Viento: ${data.current_weather.windspeed} km/h
      - Código de clima: ${data.current_weather.weathercode}
      Usa estos datos si el usuario pregunta por recomendaciones de ropa o actividades ahora mismo.`;
    }

    try {
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'X-Client-Name': 'OserTravel-Bot'
        },
        body: JSON.stringify({
          message: input, 
          preamble: systemPrompt,
          model: 'command-r-plus', 
          temperature: 0.3,
          chat_history: messages.map(m => ({ 
            role: m.role === 'user' ? 'USER' : 'CHATBOT', 
            message: m.content 
          }))
        })
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("API Key inválida.");
        if (response.status === 429) throw new Error("Cuota de API excedida.");
        throw new Error(`Error del servidor (${response.status})`);
      }

      const resData = await response.json();
      
      const botMessage: Message = { role: 'bot', content: resData.text };
      setMessages(prev => [...prev, botMessage]);

    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Error al conectar con el asistente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border border-gray-200 rounded-xl shadow-2xl bg-white overflow-hidden font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white shadow-md z-10">
        <h3 className="font-bold text-lg flex items-center gap-2">
          ✈️ OserTravel IA
        </h3>
        <p className="text-blue-100 text-xs mt-1">Tu asistente de viajes personal</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-10 opacity-60">
            <p className="text-4xl mb-2">👋</p>
            <p className="text-sm text-gray-500">¡Hola! Pregúntame sobre destinos, clima o paquetes turísticos.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-500 text-xs px-3 py-2 rounded-full animate-pulse">
              Escribiendo...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message Area */}
      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-xs p-2 text-center border-t border-red-100">
          {errorMsg}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Enviar
          </button>
        </div>
        <div className="text-center mt-1">
            <span className="text-[10px] text-gray-400">Potenciado por Cohere AI</span>
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;