import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Webcam from "react-webcam";
import axios from "axios";
import { Mic, MicOff, Video, PhoneOff, User, Sparkles, MessageSquare, StopCircle, RefreshCw, Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const HRInterview = () => {
  const { user } = useAuth();
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("Waiting to start...");

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // --- AUTO SCROLL ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- SPEECH SETUP ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = handleSpeechResult;
    }
  }, []);

  // --- 1. LOGIC FIX: Initialize Session ---
  const startInterview = async () => {
    setIsStarted(true);
    setMessages([]);

    try {
        const formData = new FormData();
        formData.append("mode", "Job Interview");

        const res = await axios.post(`${API_URL}/english/start`, formData);
        
        const introText = res.data.message;
        addMessage("ai", introText);
        setCurrentQuestion("Introduction");
        speak(introText);

    } catch (error) {
        console.error("Start Error:", error);
        const fallback = `Hello ${user?.username || "Candidate"}. I am your HR manager. Tell me about yourself.`;
        addMessage("ai", fallback);
        speak(fallback);
    }
  };

  const handleSpeechResult = async (event) => {
    const userText = event.results[0][0].transcript;
    addMessage("user", userText);
    
    try {
      const formData = new FormData();
      formData.append("message", userText);
      
      const res = await axios.post(`${API_URL}/english/chat`, formData);
      
      const aiReply = res.data.message;
      addMessage("ai", aiReply);
      setCurrentQuestion("Listening..."); 
      speak(aiReply);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
        recognitionRef.current.stop();
    } else {
        window.speechSynthesis.cancel();
        setAiSpeaking(false);
        recognitionRef.current.start();
    }
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  // --- REUSABLE GLASS CSS ---
  const waterDropGlass = "bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4)]";

  return (
    // Pure Monochrome Black Background with native scrolling capability (min-h-screen)
    <div className="min-h-screen bg-[#020202] text-gray-200 font-sans relative overflow-x-hidden flex flex-col">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.03] blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gray-500/[0.03] blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      {/* 👇 BUG FIX: Increased top padding (pt-[140px] and md:pt-[160px]) & allowed page scrolling (min-h-screen) */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col gap-8 min-h-screen pt-[140px] md:pt-[160px] pb-12">
        
        {/* --- TOP ROW: AVATAR & USER CAMERA --- */}
        <div className="flex flex-col md:flex-row gap-6 min-h-[320px]">
            
            {/* 1. AI HR INTERVIEWER */}
            <div className={`flex-1 relative rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center transition-all duration-500 min-h-[300px] ${waterDropGlass}`}>
                
                {/* AI Status Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/[0.05] border border-white/10 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg">
                    <div className={`w-2 h-2 rounded-full ${aiSpeaking ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" : "bg-gray-600"}`}></div>
                    HR System
                </div>

                {/* Cyberpunk Holographic Avatar */}
                <div className="relative flex items-center justify-center w-36 h-36 mb-8 mt-4">
                    <div className={`absolute inset-0 rounded-full border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] ${aiSpeaking ? 'animate-[spin_3s_linear_infinite]' : ''}`}></div>
                    <div className={`absolute inset-2 rounded-full border border-dashed border-white/30 ${aiSpeaking ? 'animate-[spin_4s_linear_infinite_reverse]' : ''}`}></div>
                    <div className={`absolute inset-6 rounded-full bg-white/[0.02] backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 ${aiSpeaking ? 'shadow-[inset_0_0_30px_rgba(255,255,255,0.2)] scale-110' : ''}`}>
                        <Bot size={40} className={`text-white ${aiSpeaking ? 'animate-pulse' : 'text-gray-500'}`}/>
                    </div>
                </div>
                
                {/* Current Topic Indicator */}
                <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Current Focus</p>
                    <p className="text-sm font-bold text-white truncate drop-shadow-md">{currentQuestion}</p>
                </div>
            </div>

            {/* 2. USER WEBCAM */}
            <div className="flex-1 bg-black rounded-[2.5rem] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 min-h-[300px]">
                 <Webcam 
                    audio={false}
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-90" 
                 />
                 
                 {/* User Identity Badge */}
                 <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold flex items-center gap-2 tracking-widest uppercase shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,1)]"></div> 
                    {user?.username || "Candidate"}
                 </div>
                 
                 {/* Initialization Overlay */}
                 {!isStarted && (
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-10">
                        <Sparkles size={32} className="text-gray-500 mb-6" />
                        <button onClick={startInterview} className="bg-white text-black px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2">
                            Initialize Interview
                        </button>
                     </div>
                 )}
            </div>
        </div>

        {/* --- BOTTOM ROW: TRANSCRIPT & DOCK --- */}
        <div className={`flex-1 rounded-[2.5rem] flex flex-col overflow-hidden min-h-[400px] ${waterDropGlass}`}>
            
            {/* Header / Control Dock */}
            <div className="p-4 md:p-6 border-b border-white/5 bg-black/20 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="font-bold text-white flex items-center gap-2 text-sm tracking-widest uppercase">
                    <MessageSquare size={16} className="text-gray-400"/> Live Protocol
                </h2>
                
                {isStarted && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={toggleMic} 
                            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] border ${
                                isListening 
                                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-pulse" 
                                : "bg-white/[0.05] text-white border-white/20 hover:bg-white/[0.1]"
                            }`}
                        >
                            {isListening ? <><StopCircle size={14}/> Recording</> : <><Mic size={14}/> Speak</>}
                        </button>
                        <button onClick={startInterview} className="p-2.5 rounded-full bg-white/[0.02] border border-white/5 hover:bg-white/[0.1] text-gray-400 hover:text-white transition-all">
                            <RefreshCw size={14}/>
                        </button>
                    </div>
                )}
            </div>

            {/* Transcript Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5 custom-scrollbar bg-transparent">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600">
                        <MessageSquare size={40} className="mb-4 opacity-50"/>
                        <p className="text-xs font-bold uppercase tracking-widest">Awaiting Communication...</p>
                    </div>
                )}
                
                {messages.map((msg, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`max-w-[85%] md:max-w-[70%] p-5 rounded-3xl text-sm leading-relaxed tracking-wide font-medium shadow-xl backdrop-blur-md border
                            ${msg.sender === 'user' 
                                ? 'bg-white text-black rounded-br-sm border-transparent' 
                                : 'bg-black/60 text-gray-200 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-bl-sm'}`}
                        >
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                
                {/* Visual indicator when waiting for AI */}
                {isStarted && !aiSpeaking && !isListening && messages.length > 0 && messages[messages.length-1].sender === 'user' && (
                   <div className="flex items-start">
                     <div className="bg-black/60 border border-white/10 p-4 rounded-3xl rounded-bl-sm flex gap-1.5 items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                     </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>

      </div>
    </div>
  );
};

export default HRInterview;