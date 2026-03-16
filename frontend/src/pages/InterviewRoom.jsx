import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Webcam from "react-webcam";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, Send, Volume2, XCircle, Video, VideoOff, Mic as MicIcon, MicOff as MicOffIcon, Loader, Keyboard, RotateCcw, Sparkles, AlertTriangle, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const InterviewRoom = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // --- STATES (UNTOUCHED LOGIC) ---
  const [question, setQuestion] = useState("Initializing...");
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState(""); 
  const [scores, setScores] = useState([]); 
  
  const hasStarted = useRef(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [warning, setWarning] = useState(""); 

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem("interviewConfig"));
    if (!savedConfig) { window.location.href = "/setup"; return; }
    setConfig(savedConfig);
  }, []);

  // Proctoring & Audio Cleanup
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) setWarning("WARNING: Tab Switching Detected!");
      else setTimeout(() => setWarning(""), 4000);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.speechSynthesis.cancel(); 
    };
  }, []);

  useEffect(() => {
    if (transcript) setUserAnswer(transcript);
  }, [transcript]);

  const speak = (text) => {
    window.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startInterview = async () => {
    if (hasStarted.current || !config) return;
    hasStarted.current = true;
    setLoading(true);
    setQuestion(`Connecting to AI Core...`);

    try {
      const formData = new FormData();
      formData.append("topic", config.topic);
      formData.append("level", config.level);
      formData.append("mode", config.mode); 
      formData.append("total_questions", config.totalQuestions); 

      const res = await axios.post(`${API_URL}/interview/start`, formData);
      setQuestion(res.data.message);
      speak(res.data.message);
      setQuestionCount(1); 
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim() || loading) return; 
    setLoading(true);

    const formData = new FormData();
    formData.append("answer", userAnswer); 

    try {
      const res = await axios.post(`${API_URL}/interview/chat`, formData);
      
      const aiResponse = res.data.message;
      const turnScore = res.data.score || 70; 

      setScores(prev => [...prev, turnScore]);
      resetTranscript();
      setUserAnswer(""); 
      
      // 👇 CHANGE 2: LAST QUESTION PE DIRECT RESULT PAGE JAYEGA 👇
      if (questionCount >= config.totalQuestions) {
          autoEndInterview(turnScore); // Removed the setTimeout delay and speak()
      } else {
          setQuestion(aiResponse);
          speak(aiResponse);
          setQuestionCount(prev => prev + 1);
      }
    } catch (error) { 
      console.error(error); 
    } finally {
      setLoading(false);
    }
  };

  const autoEndInterview = async (lastScore) => {
    setLoading(true);
    window.speechSynthesis.cancel(); 

    try {
        const formData = new FormData();
        formData.append("email", user?.email);
        formData.append("topic", config?.topic);

        const res = await axios.post(`${API_URL}/interview/end`, formData);
        localStorage.setItem("interviewResult", res.data.message);
        navigate("/result");

    } catch (error) { 
        console.log("Error ending interview:", error); 
        navigate("/result");
    }
    setLoading(false);
  };

  const endInterview = async (lastScore = 0) => {
    setLoading(true);
    window.speechSynthesis.cancel(); 
    
    const allScores = [...scores]; 
    if(lastScore > 0 && !allScores.includes(lastScore)) allScores.push(lastScore);

    const totalScore = allScores.reduce((a, b) => a + b, 0);
    const avgScore = allScores.length > 0 ? Math.round((totalScore / allScores.length) * 10) : 0; 

    const finalScore = Math.min(Math.max(avgScore, 10), 100); 

    const feedbackSummary = `SCORE: ${finalScore}. \n\nSession Completed. \n\nMode: ${config?.mode}. \nAvg Rating: ${avgScore/10}/10. \nKeep practicing!`;

    try {
        const userEmail = user?.email; 
        if (!userEmail) { navigate("/login"); return; }

        await axios.post(`${API_URL}/dashboard/save`, {
            email: userEmail,
            type: "interview", 
            topic: `Tech Mock: ${config?.topic}`,
            score: finalScore,
            date: new Date().toISOString().split('T')[0]
        });

        localStorage.setItem("interviewResult", feedbackSummary);
        navigate("/result");

    } catch (error) { console.log(error); }
    setLoading(false);
  };

  const handleManualInput = (e) => setUserAnswer(e.target.value);

  // 👇 CHANGE 1: AI KO CHUP KARWANE WALA LOGIC 👇
  const handleMicToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      window.speechSynthesis.cancel(); // AI turant chup ho jayega
      SpeechRecognition.startListening();
    }
  };

  if (!browserSupportsSpeechRecognition) return <div className="min-h-screen bg-black text-white flex items-center justify-center">No Voice Support in this browser.</div>;

  // --- REUSABLE GLASS CSS ---
  const waterDropGlass = "bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4)]";
  const carvedInput = "w-full bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-black/60 shadow-[inset_0px_2px_10px_rgba(0,0,0,0.8)] transition-all font-medium custom-scrollbar resize-none";

  return (
    <div className="min-h-screen bg-[#020202] text-gray-200 flex flex-col relative overflow-hidden font-sans">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.02] blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/[0.03] blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>
      
      {/* --- TOP HEADER BAR --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-28 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className={`${waterDropGlass} px-5 py-2.5 rounded-full flex items-center gap-3`}>
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse delay-150"></div>
                </div>
                <h2 className="text-sm font-bold text-white tracking-widest uppercase">
                    Q: <span className="text-gray-400">{questionCount} / {config?.totalQuestions}</span>
                </h2>
            </div>
            
            {config?.mode && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.02] text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Sparkles size={12}/> {config.mode}
                </span>
            )}
        </div>

        <button onClick={() => endInterview()} className="group bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 px-5 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-300">
            <XCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" /> End Session
        </button>
      </div>

      {/* --- MAIN INTERVIEW ARENA --- */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row px-4 md:px-6 pb-6 gap-6 max-w-7xl mx-auto w-full">
        
        {/* ================= LEFT: AI INTERVIEWER ================= */}
        <div className="w-full md:w-5/12 flex flex-col gap-6">
          
          {/* Holographic AI Avatar */}
          <div className={`${waterDropGlass} rounded-[2.5rem] p-8 h-[300px] flex items-center justify-center relative overflow-hidden group`}>
             <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
             
             {/* AI Core Animation */}
             <div className="relative flex items-center justify-center w-32 h-32">
                <div className={`absolute inset-0 rounded-full border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] ${hasStarted.current ? 'animate-[spin_4s_linear_infinite]' : ''}`}></div>
                <div className={`absolute inset-2 rounded-full border border-dashed border-white/40 ${hasStarted.current ? 'animate-[spin_6s_linear_infinite_reverse]' : ''}`}></div>
                <div className="absolute inset-6 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]">
                    <Bot size={36} className={`text-white ${loading ? 'animate-pulse' : ''}`} />
                </div>
             </div>

             {/* Start Overlay */}
             {!hasStarted.current && config && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-[2.5rem]">
                    <button onClick={startInterview} className="bg-white text-black px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2">
                        Initialize AI
                    </button>
                </div>
             )}
          </div>
          
          {/* AI Question Box */}
          <div className={`${waterDropGlass} p-8 rounded-[2rem] min-h-[200px] relative flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Volume2 size={14}/> Incoming Transmission
                </h3>
                <button onClick={() => speak(question)} className="p-2 bg-white/[0.05] rounded-full hover:bg-white/[0.1] text-white transition-colors">
                    <Volume2 size={16}/>
                </button>
            </div>
            
            <p className="text-lg md:text-xl font-medium leading-relaxed tracking-wide text-gray-200 flex-1">
                {question}
            </p>
            
            {loading && !hasStarted.current === false && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <Loader size={14} className="animate-spin" /> Processing...
                </div>
            )}
          </div>

        </div>

        {/* ================= RIGHT: USER ARENA ================= */}
        <div className="w-full md:w-7/12 flex flex-col gap-6">
          
          {/* Webcam Box */}
          <div className={`relative rounded-[2.5rem] overflow-hidden h-[300px] md:h-[350px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black transition-all duration-300 ${warning ? "border border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.3)]" : "border border-white/10"}`}>
            
            {isCameraOn ? (
                <Webcam audio={!isMuted} className="w-full h-full object-cover opacity-90" mirrored={true} />
            ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-[#050505]">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                        <VideoOff size={32} className="text-gray-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Camera Disabled</span>
                </div>
            )}

            {/* Live Indicator */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">REC</span>
            </div>

            {/* Proctoring Warning Overlay */}
            <AnimatePresence>
                {warning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 border-4 border-red-500 rounded-[2.5rem]">
                        <AlertTriangle size={48} className="text-red-500 mb-4 animate-bounce" />
                        <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Attention</h2>
                        <p className="text-red-200 font-medium text-sm">{warning}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating AV Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    {isMuted ? <MicOffIcon size={18}/> : <MicIcon size={18}/>}
                </button>
                <button onClick={() => setIsCameraOn(!isCameraOn)} className={`p-3 rounded-full transition-all ${!isCameraOn ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                    {!isCameraOn ? <VideoOff size={18}/> : <Video size={18}/>}
                </button>
            </div>
          </div>

          {/* Answer Input Area */}
          <div className={`${waterDropGlass} p-6 md:p-8 rounded-[2.5rem] flex-1 flex flex-col`}>
             <div className="flex justify-between items-center mb-4">
                 <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Keyboard size={14}/> Your Response
                 </label>
                 <AnimatePresence>
                     {userAnswer && (
                         <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { resetTranscript(); setUserAnswer(""); }} className="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/[0.05] px-3 py-1.5 rounded-full">
                             <RotateCcw size={12}/> Clear
                         </motion.button>
                     )}
                 </AnimatePresence>
             </div>
             
             <textarea 
                value={userAnswer} 
                onChange={handleManualInput} 
                placeholder="Type your answer or use the microphone..." 
                className={`${carvedInput} flex-1 min-h-[100px] mb-6`}
             />

             {/* Action Dock */}
             <div className="flex gap-4 mt-auto">
                <button 
                    onClick={handleMicToggle} // 👈 UPDATED HANDLER HERE
                    className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border ${
                        listening 
                        ? 'bg-red-500/20 text-red-500 border-red-500/50 animate-pulse' 
                        : 'bg-white/[0.05] text-white border-white/10 hover:bg-white/[0.1]'
                    }`}
                >
                    {listening ? "Recording..." : "Speak"}
                </button>
                
                <button 
                    onClick={handleSubmit} 
                    disabled={loading || !userAnswer.trim()} 
                    className="flex-1 bg-white text-black disabled:bg-white/20 disabled:text-gray-500 disabled:cursor-not-allowed py-4 rounded-xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-all hover:bg-gray-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                    {loading ? <Loader size={16} className="animate-spin"/> : <><Send size={16}/> Submit</>}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;