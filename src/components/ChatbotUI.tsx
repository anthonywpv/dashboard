import { useState, useRef, useEffect } from 'react';
import { CohereClientV2 } from 'cohere-ai';
import { 
  Box, TextField, Paper, Typography, CircularProgress, IconButton, Fab, Fade, Avatar 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface OpenMeteoResponse {
  latitude?: number;
  longitude?: number;
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: any; 
}

interface ChatbotProps {
  data: OpenMeteoResponse | null;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const ChatbotUI = ({ data }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Variable de entorno
  const API_KEY = import.meta.env.VITE_COHERE_API_KEY; 
  const cohere = new CohereClientV2({ token: API_KEY });

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const now = Date.now();
    const recentRequests = requestTimestamps.filter(t => now - t < 60000);
    if (recentRequests.length >= 10) {
      setErrorMsg("Demasiadas preguntas. Espera un minuto.");
      setRequestTimestamps(recentRequests);
      return;
    }
    setRequestTimestamps([...recentRequests, now]);

    setErrorMsg(null);
    setIsLoading(true);

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');


    let weatherContext = "Cargando datos...";
    
    if (data && data.current) {
      weatherContext = `[DATOS EN TIEMPO REAL]:
      - Temperatura: ${data.current.temperature_2m}°C
      - Sensación Térmica: ${data.current.apparent_temperature}°C
      - Humedad: ${data.current.relative_humidity_2m}%
      - Viento: ${data.current.wind_speed_10m} km/h
      - Es de día: ${data.current.is_day ? 'Sí' : 'No'}
      - Código clima: ${data.current.weather_code}
      
      Usa estos datos para responder. Si preguntan "¿hace calor?", mira la temperatura.`;
    }

    const systemMessage: Message = {
      role: 'system',
      content: `Eres un experto meteorólogo, un asistente climático llamado ClimaBot. ${weatherContext} Responde de forma breve dando un pequeño resumen del clima antes que nada. Tienes que ser amigable y usar emojies siempre para complementar tus respuestas. Preguntale su nombre solo si aun no te lo ha dicho.`
    };

    try {
      const response = await cohere.chat({
        model: 'command-r-plus-08-2024',
        messages: [
          systemMessage, 
          ...messages.map(m => ({ role: m.role, content: m.content })),
          userMessage
        ],
      });

      if (response && response.message && response.message.content) {
        const textContent = response.message.content.find((c) => c.type === "text");
        const botText = (textContent as any)?.text || "Error leyendo respuesta.";
        
        setMessages(prev => [...prev, { role: 'assistant', content: botText }]);
      }

    } catch (error) {
      console.error(error);
      setErrorMsg("Error de conexión con la IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <Fade in={isOpen}>
        <Paper elevation={6} sx={{ width: 320, height: 450, mb: 2, borderRadius: 4, display: isOpen ? 'flex' : 'none', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ bgcolor: '#1976d2', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'white', color: '#1976d2', width: 30, height: 30 }}><SmartToyIcon fontSize="small" /></Avatar>
              <Typography variant="subtitle1" fontWeight="bold">Asistente Clima</Typography>
            </Box>
            <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}><CloseIcon /></IconButton>
          </Box>

          {/* Mensajes */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
            {messages.length === 0 && <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 2 }}>Pregúntame sobre el clima actual.</Typography>}
            {messages.map((msg, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                <Paper sx={{ p: 1.5, maxWidth: '85%', bgcolor: msg.role === 'user' ? '#1976d2' : 'white', color: msg.role === 'user' ? 'white' : 'text.primary', borderRadius: 2 }}>
                  <Typography variant="body2">{msg.content}</Typography>
                </Paper>
              </Box>
            ))}
            {isLoading && <CircularProgress size={15} sx={{ display: 'block', mx: 'auto', mt: 1 }} />}
            {errorMsg && <Typography color="error" variant="caption" display="block" align="center">{errorMsg}</Typography>}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, bgcolor: 'white', display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" placeholder="Escribe..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyPress} disabled={isLoading} />
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isLoading}><SendIcon /></IconButton>
          </Box>
        </Paper>
      </Fade>
      <Fab color="primary" onClick={toggleChat} sx={{ width: 60, height: 60 }}>{isOpen ? <CloseIcon /> : <ChatIcon />}</Fab>
    </Box>
  );
};

export default ChatbotUI;