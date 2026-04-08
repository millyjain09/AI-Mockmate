import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, Home, RefreshCw, Download, AlertTriangle, 
  Award, MessageSquare, Sparkles, FileText, Bot, Zap, Target, TrendingUp 
} from "lucide-react";

const ResultPage = () => {
  const feedbackRaw = localStorage.getItem("interviewResult") || "No feedback generated.";
  const storedScore = localStorage.getItem("interviewScore"); 
  const historyRaw = localStorage.getItem("interviewHistory");

  let parsedScore = 0;
  const scoreMatch = feedbackRaw.match(/SCORE[^\d]*(\d+)/i); 
  if (scoreMatch) {
    parsedScore = parseInt(scoreMatch[1], 10);
  } else if (storedScore) {
    parsedScore = parseInt(storedScore, 10);
  }

  const [feedback, setFeedback] = useState(feedbackRaw);
  const [targetScore, setTargetScore] = useState(parsedScore);
  const [displayScore, setDisplayScore] = useState(0); 
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    if (historyRaw) {
      try {
        setConversation(JSON.parse(historyRaw));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, [historyRaw]);

  useEffect(() => {
    let start = 0;
    const duration = 2000; 
    if (targetScore === 0) return; 
    const increment = targetScore / (duration / 16); 
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [targetScore]);

  let themeConfig = {
    color: "text-gray-400",
    stroke: "stroke-gray-600",
    bgGlow: "shadow-[0_0_50px_rgba(156,163,175,0.1)]",
    message: "Needs Improvement",
    icon: AlertTriangle,
    accent: "bg-gray-500"
  };

  if (targetScore >= 80) {
    themeConfig = {
      color: "text-[#4ADE80]", 
      stroke: "stroke-[#4ADE80]",
      bgGlow: "shadow-[0_0_60px_rgba(74,222,128,0.2)]",
      message: "Exceptional Performance",
      icon: Award,
      accent: "bg-[#4ADE80]"
    };
  } else if (targetScore >= 50) {
    themeConfig = {
      color: "text-yellow-400", 
      stroke: "stroke-yellow-400",
      bgGlow: "shadow-[0_0_50px_rgba(250,204,21,0.15)]",
      message: "Strong Foundation",
      icon: CheckCircle,
      accent: "bg-yellow-400"
    };
  }

  const handleDownload = () => {
    const cleanText = feedback.replace(/\*/g, '');
    const fileContent = `MOCKMATE PROFESSIONAL EVALUATION\nScore: ${targetScore}/100\n\n${cleanText}`;
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "MockMate_Evaluation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderCleanFeedback = (rawText) => {
    if (!rawText) return null;
    const clean = rawText.replace(/\*/g, '').replace(/---/g, '').trim();
    
    // Split into logical blocks
    const parts = clean.split(/(Feedback:|Tip:|SCORE:)/i).filter(p => p.trim().length > 0);
    
    return (
      <div className="space-y-8">
        {parts.map((item, i) => {
          if (/SCORE:/i.test(item) || (parts[i-1] && /SCORE:/i.test(parts[i-1]))) return null;

          const isHeader = /Feedback:|Tip:/i.test(item);
          if (isHeader) return null;

          const label = /Feedback:/i.test(parts[i-1]) ? "Technical Analysis" : "Growth Strategy";
          const icon = label === "Technical Analysis" ? <Target size={18}/> : <TrendingUp size={18}/>;
          const accentColor = label === "Technical Analysis" ? "text-blue-400" : "text-purple-400";

          const bullets = item.split(/\.\s+/).filter(s => s.trim().length > 10);

          return (
            <div key={i} className="group relative">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${accentColor}`}>
                  {icon}
                </div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">
                  {label}
                </h4>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 ml-2">
                {bullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${themeConfig.accent}`}></div>
                    <p className="text-gray-400 text-[15px] leading-relaxed">
                      {bullet.trim()}{!bullet.trim().endsWith('.') && '.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const glassCard = "bg-white/[0.01] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2.5rem]";

  return (
    <div className="min-h-screen bg-[#020202] text-gray-200 font-sans relative overflow-hidden pb-20">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/[0.02] blur-[140px]"></div>
         <div className={`absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full ${themeConfig.accent} opacity-[0.07] blur-[150px]`}></div>
         <div className="absolute inset-0 bg-[url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>
      
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">
                    <Zap size={12} className="text-yellow-500" /> Evaluation Report
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">Interview <span className="text-gray-500 text-4xl md:text-5xl font-light">Insights</span></h1>
            </div>
            <div className="flex gap-3">
               <button onClick={handleDownload} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white">
                  <Download size={20} />
               </button>
               <Link to="/setup" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95">
                  <RefreshCw size={16} /> Retake session
               </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Score & Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`${glassCard} p-10 flex flex-col items-center text-center relative overflow-hidden`}>
              <div className={`absolute top-0 inset-x-0 h-1 ${themeConfig.accent}`}></div>
              
              <div className={`relative w-44 h-44 mb-8 ${themeConfig.bgGlow} rounded-full flex items-center justify-center border border-white/5 bg-black/20`}>
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="62" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                  <motion.circle 
                    cx="70" cy="70" r="62" fill="transparent" 
                    className={themeConfig.stroke} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 62}
                    initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 62) - (displayScore/100) * (2 * Math.PI * 62) }}
                    transition={{ duration: 2, ease: "circOut" }}
                  />
                </svg>
                <div className="flex flex-col">
                  <span className="text-6xl font-black text-white tracking-tighter">{displayScore}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Rating</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className={`text-xl font-black uppercase tracking-tight ${themeConfig.color}`}>{themeConfig.message}</h2>
                <p className="text-gray-500 text-xs font-medium px-4">Based on your technical accuracy and communication flow.</p>
              </div>
            </div>

            <div className={`${glassCard} p-6 flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-all`}>
               <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><Bot size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI Assistant</p>
                    <p className="text-sm font-bold text-white">Full Report Ready</p>
                  </div>
               </div>
               <FileText size={18} className="text-gray-600 group-hover:text-white transition-colors"/>
            </div>
          </div>

          {/* Main Feedback Content */}
          <div className="lg:col-span-8 space-y-10">
            <div className={`${glassCard} p-10 md:p-14`}>
              <div className="flex items-center gap-4 mb-12">
                 <h3 className="text-2xl font-black text-white tracking-tight">Performance Breakdown</h3>
                 <div className="flex-1 h-[1px] bg-white/5"></div>
              </div>
              {renderCleanFeedback(feedback)}
            </div>

            {/* Transcript with proper spacing */}
            <div className={`${glassCard} p-10 md:p-14`}>
               <div className="flex items-center gap-4 mb-10">
                  <MessageSquare size={22} className="text-gray-500"/>
                  <h3 className="text-xl font-black text-white tracking-tight">Session Transcript</h3>
               </div>
               
               <div className="space-y-10 border-l border-white/5 pl-8">
                  {conversation.length === 0 ? (
                    <p className="text-gray-600 italic text-sm">No transcript available for this session.</p>
                  ) : (
                    conversation.map((msg, index) => (
                      <div key={index} className="relative">
                        <div className={`absolute -left-[37px] top-1 w-2 h-2 rounded-full border border-[#020202] ${msg.role === "User" ? "bg-white" : "bg-gray-600"}`}></div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${msg.role === "User" ? "text-gray-400" : "text-blue-500/80"}`}>
                          {msg.role === "User" ? "Candidate" : "Interviewer"}
                        </p>
                        <p className={`text-[15px] leading-relaxed ${msg.role === "User" ? "text-white font-medium" : "text-gray-400"}`}>
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-20 flex justify-center border-t border-white/5 pt-10">
          <Link to="/dashboard" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
            <Home size={14} /> Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPage;