import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Volume2, ArrowLeft, RefreshCw, Briefcase, Building2, Presentation, BookOpen, AlertCircle, MessageCircle, Sparkles, ArrowRight, Loader } from "lucide-react";
import LaserFlow from "../components/LaserFlow"; 

const EnglishPractice = () => {
  // --- STATES (UNTOUCHED LOGIC) ---
  const [step, setStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // --- SCENARIOS (UNTOUCHED) ---
  const scenarios = [
    { id: "interview", title: "Job Interview", desc: "Practice answering tough HR questions.", icon: <Briefcase /> },
    { id: "workplace", title: "Workplace", desc: "Professional language for meetings and daily work.", icon: <Building2 /> },
    { id: "pitch", title: "Client Pitch", desc: "Explain technical concepts to non-technical clients.", icon: <Presentation /> },
    { id: "debate", title: "Debate & Logic", desc: "Discuss complex topics and articulate opinions.", icon: <BookOpen /> },
  ];

  // --- 1. ROBUST SPEECH SETUP (UNTOUCHED LOGIC) ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; 
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onresult = handleSpeechResult;
    }
    return () => {
        if (recognitionRef.current) recognitionRef.current.abort();
        window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 2. HANDLERS (UNTOUCHED LOGIC) ---
  const startSession = async (topic) => {
    setSelectedTopic(topic);
    setStep(2); 
    setLoading(true);
    window.speechSynthesis.cancel();

    const formData = new FormData();
    formData.append("mode", topic.title); 

    try {
      const res = await axios.post("http://127.0.0.1:8000/english/start", formData);
      const aiMsg = res.data.message;
      addMessage("ai", aiMsg);
      speak(aiMsg);
    } catch (error) {
      console.error("Connection Error", error);
      addMessage("ai", `Hello! Let's start practicing ${topic.title}. (Offline Mode)`);
    }
    setLoading(false);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
        alert("Browser not supported. Use Chrome.");
        return;
    }
    if (isListening) {
        recognitionRef.current.stop();
    } else {
        window.speechSynthesis.cancel();
        setAiSpeaking(false);
        try { recognitionRef.current.start(); } catch (e) { console.error("Mic Error:", e); }
    }
  };

  const handleSpeechResult = async (event) => {
    const userText = event.results[0][0].transcript;
    addMessage("user", userText);
    setLoading(true);

    const formData = new FormData();
    formData.append("message", userText);

    try {
      const res = await axios.post("http://127.0.0.1:8000/english/chat", formData);
      const aiReply = res.data.message;
      const correction = res.data.correction || null;
      addMessage("ai", aiReply, correction);
      speak(aiReply);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const addMessage = (sender, text, correction = null) => {
    setMessages(prev => [...prev, { sender, text, correction }]);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setAiSpeaking(false);
  };

  // --- REUSABLE GLASS CSS ---
  const waterDropGlass = "bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4)]";

  return (
    <div className="min-h-screen bg-[#020202] text-gray-200 font-sans relative overflow-hidden flex flex-col">
      
      {/* ================= BACKGROUND: REACTIVE LASER FLOW ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <LaserFlow 
           color="#ffffff" 
           flowSpeed={isListening ? 0.8 : (aiSpeaking ? 0.5 : 0.2)} 
           wispSpeed={isListening ? 35 : 15} 
           wispIntensity={isListening ? 8 : 3}
           fogIntensity={0.5}
           horizontalSizing={1}
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/90 backdrop-blur-[2px]"></div>
         <div className="absolute inset-0 bg-[url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-5xl mx-auto w-full p-6 md:p-8 pt-24 md:pt-32">
        
        <AnimatePresence mode="wait">
          {/* ================= STEP 1: MODERN SCENARIO SELECTION ================= */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center w-full"
            >
                <div className="text-center mb-14">
                   <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`${waterDropGlass} inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white mb-6 shadow-xl`}>
                     <Sparkles size={14} /> System Ready
                   </motion.div>
                   <h1 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter">
                      Select Parameters
                   </h1>
                   <p className="text-gray-400 font-medium text-sm md:text-base max-w-lg mx-auto">
                      Calibrate your AI environment. Choose a simulation to begin targeted vocal analysis.
                   </p>
                </div>

                {/* THE NEW BENTO/DYNAMIC GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                   {scenarios.map((scenario, idx) => (
                      <motion.div 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                          key={scenario.id}
                          onClick={() => startSession(scenario)}
                          // Replaced standard box with a tall, dynamic container
                          className="group relative h-[280px] p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 backdrop-blur-xl overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                      >
                          {/* Inner Ambient Glow on Hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                          {/* Giant Holographic Watermark Icon */}
                          <div className="absolute -right-8 -bottom-8 text-white opacity-[0.02] group-hover:opacity-[0.06] group-hover:scale-110 group-hover:-translate-x-4 group-hover:-translate-y-4 transition-all duration-700 pointer-events-none">
                              {React.cloneElement(scenario.icon, { size: 180, strokeWidth: 1 })}
                          </div>

                          {/* Top Icon Badge (Moves slightly down on hover for depth) */}
                          <div className="absolute top-8 left-8 flex items-center justify-center w-12 h-12 rounded-[1.2rem] bg-black/50 border border-white/10 text-gray-500 group-hover:text-white group-hover:bg-white/[0.08] group-hover:border-white/20 group-hover:translate-y-1 transition-all duration-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
                              {React.cloneElement(scenario.icon, { size: 20 })}
                          </div>

                          {/* Text Content (Slides up on hover to reveal CTA) */}
                          <div className="relative z-10 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                              <h2 className="text-2xl font-bold text-gray-300 group-hover:text-white tracking-tight mb-2 transition-colors duration-300">
                                  {scenario.title}
                              </h2>
                              <p className="text-sm text-gray-500 group-hover:text-gray-300 line-clamp-2 transition-colors duration-300 leading-relaxed font-medium">
                                  {scenario.desc}
                              </p>

                              {/* Action Text - Fades and slides in from left */}
                              <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0">
                                  <span className="text-[11px] font-black tracking-[0.3em] text-white uppercase">Initiate</span>
                                  <ArrowRight size={14} className="text-white" />
                              </div>
                          </div>
                      </motion.div>
                   ))}
                </div>
            </motion.div>
          )}

          {/* ================= STEP 2: PRACTICE ROOM (UNTOUCHED) ================= */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col h-[calc(100vh-140px)] w-full max-w-4xl mx-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                  <button onClick={() => window.location.reload()} className={`${waterDropGlass} px-4 py-2 rounded-xl flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold active:scale-95`}>
                      <ArrowLeft size={16}/> Back
                  </button>
                  <div className={`${waterDropGlass} px-5 py-2 rounded-full flex items-center gap-2 shadow-lg`}>
                      <div className={`w-2 h-2 rounded-full bg-white ${isListening ? 'animate-ping' : ''}`}></div>
                      <span className="text-xs font-bold text-white uppercase tracking-widest">
                          {selectedTopic?.title} Mode
                      </span>
                  </div>
                  <div className="w-20"></div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-white/[0.01] backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-[inset_0_4px_30px_rgba(0,0,0,0.5)] relative custom-scrollbar">
                  {messages.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                          <MessageCircle size={80} className="mb-4 text-white"/>
                          <p className="font-bold tracking-widest uppercase text-white">Waiting for response...</p>
                      </div>
                  )}
                  
                  {messages.map((msg, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        key={idx} 
                        className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? "ml-auto items-end" : "mr-auto items-start"}`}
                      >
                          <div className={`p-5 text-sm md:text-base leading-relaxed tracking-wide font-medium shadow-xl backdrop-blur-md
                              ${msg.sender === 'user' 
                                  ? "bg-white text-black rounded-3xl rounded-tr-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                                  : "bg-black/60 border border-white/10 text-white rounded-3xl rounded-tl-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"}`}
                          >
                              {msg.text}
                          </div>

                          {msg.correction && (
                              <div className="mt-3 bg-white/[0.05] border border-white/10 p-3.5 rounded-2xl text-xs text-gray-300 flex items-start gap-3 max-w-full backdrop-blur-lg shadow-inner">
                                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-white"/>
                                  <span className="leading-relaxed"><span className="font-bold text-white tracking-wide">Feedback:</span> {msg.correction}</span>
                              </div>
                          )}
                          
                          {msg.sender === 'ai' && (
                               <button onClick={() => speak(msg.text)} className="mt-2 text-gray-500 hover:text-white transition-colors text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider ml-2">
                                  <Volume2 size={12}/> Replay
                              </button>
                          )}
                      </motion.div>
                  ))}
                  {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest mt-2 ml-2">
                       <Loader size={14} className="animate-spin" /> AI is thinking...
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
              </div>

              {/* Controls Dock */}
              <div className="mt-6 flex flex-col items-center justify-center">
                  <div className="h-6 mb-4 flex items-center justify-center">
                      {isListening && <span className="text-white font-black text-xs tracking-[0.2em] animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">LISTENING...</span>}
                      {aiSpeaking && !isListening && <span className="text-gray-400 font-bold text-xs tracking-widest flex items-center gap-2">AI SPEAKING <Loader size={12} className="animate-spin"/></span>}
                  </div>

                  <div className={`${waterDropGlass} px-6 py-4 rounded-full flex items-center gap-6`}>
                      <button 
                        onClick={stopAudio} 
                        disabled={!aiSpeaking} 
                        className={`p-3.5 rounded-full transition-all border ${aiSpeaking ? "bg-white/[0.05] border-white/20 text-white hover:bg-white/[0.1]" : "bg-transparent border-transparent text-gray-600 cursor-not-allowed"}`}
                      >
                          <Square size={18}/>
                      </button>

                      <button 
                          onClick={toggleListening}
                          className={`p-5 rounded-full transition-all duration-300 transform active:scale-90 border flex items-center justify-center relative
                            ${isListening 
                              ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.8)] scale-110" 
                              : "bg-white/[0.08] text-white border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] hover:bg-white/[0.15]"}`}
                      >
                           <Mic size={24} />
                      </button>

                      <button onClick={() => window.location.reload()} className="p-3.5 rounded-full bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all">
                          <RefreshCw size={18}/>
                      </button>
                  </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnglishPractice;