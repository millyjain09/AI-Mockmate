import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home, RefreshCw, Download, AlertTriangle, Award, MessageSquare, Sparkles, FileText } from "lucide-react";

const ResultPage = () => {
  // 1. Data Retrieval
  const feedbackRaw = localStorage.getItem("interviewResult") || "No feedback generated.";
  const storedScore = localStorage.getItem("interviewScore"); 
  const historyRaw = localStorage.getItem("interviewHistory");

  // 👇 SMART SCORE EXTRACTION: Extract score directly from AI text if storedScore is missing
  let parsedScore = 0;
  // This regex finds the word "SCORE" and extracts the first number right after it
  const scoreMatch = feedbackRaw.match(/SCORE[^\d]*(\d+)/i); 
  if (scoreMatch) {
    parsedScore = parseInt(scoreMatch[1], 10);
  } else if (storedScore) {
    parsedScore = parseInt(storedScore, 10);
  }

  // 2. State Parsing
  const [feedback, setFeedback] = useState(feedbackRaw);
  const [targetScore, setTargetScore] = useState(parsedScore);
  const [displayScore, setDisplayScore] = useState(0); // For counting animation
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

  // 3. Score Counting Animation
  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5 seconds
    if (targetScore === 0) return; // Prevent division by zero logic
    
    const increment = targetScore / (duration / 16); // 60fps

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

  // 4. Dynamic Theme based on Score
  // 👇 CHANGED RED TO GREY AS REQUESTED 👇
  let themeConfig = {
    color: "text-gray-400",
    stroke: "stroke-gray-400",
    bgGlow: "shadow-[0_0_40px_rgba(156,163,175,0.15)]",
    message: "Needs Improvement",
    icon: AlertTriangle
  };

  if (targetScore >= 80) {
    themeConfig = {
      color: "text-[#4ADE80]", // Kept premium green for excellent
      stroke: "stroke-[#4ADE80]",
      bgGlow: "shadow-[0_0_40px_rgba(74,222,128,0.2)]",
      message: "Excellent Job! 🚀",
      icon: Award
    };
  } else if (targetScore >= 50) {
    themeConfig = {
      color: "text-yellow-400", // Kept yellow for average
      stroke: "stroke-yellow-400",
      bgGlow: "shadow-[0_0_40px_rgba(250,204,21,0.15)]",
      message: "Good Effort! 👍",
      icon: CheckCircle
    };
  }

  const Icon = themeConfig.icon;

  // For the Circular Progress Bar
  const circleRadius = 60;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // 5. Download Report Logic
  const handleDownload = () => {
    let fileContent = `AI MOCKMATE REPORT\nSCORE: ${targetScore}/100\n\nFEEDBACK:\n${feedback}\n\n====================\nTRANSCRIPT:\n====================\n`;
    
    conversation.forEach((msg) => {
      fileContent += `[${msg.role}]: ${msg.message}\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "MockMate_Interview_Report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Reusable Glassmorphism Class
  const glassCard = "bg-white/[0.02] backdrop-blur-2xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.8)] rounded-[2rem]";

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-200 font-sans relative overflow-hidden pb-20">
      
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/[0.01] blur-[120px]"></div>
         <div className={`absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full ${themeConfig.color.replace('text', 'bg')} opacity-10 blur-[150px]`}></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                <Sparkles size={12} className={themeConfig.color} /> Final Evaluation
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
              Performance Analysis
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-medium">Detailed AI review and full interview transcript.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= LEFT: SCORE CARD ================= */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className={`${glassCard} p-8 flex flex-col items-center sticky top-32 text-center`}>
              
              {/* Animated Circular Progress */}
              <div className={`relative w-48 h-48 mb-6 rounded-full flex items-center justify-center bg-black/40 border border-white/5 ${themeConfig.bgGlow}`}>
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r={circleRadius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle 
                    cx="70" cy="70" r={circleRadius} 
                    fill="transparent" 
                    className={themeConfig.stroke} 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-6xl font-black ${themeConfig.color} tracking-tighter`}>{displayScore}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Out of 100</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-8 bg-white/[0.03] px-5 py-2 rounded-full border border-white/5">
                <Icon className={themeConfig.color} size={20} />
                <h2 className={`text-lg font-bold ${themeConfig.color}`}>{themeConfig.message}</h2>
              </div>
              
              <button 
                onClick={handleDownload} 
                className="w-full bg-white text-black hover:bg-gray-200 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Download size={16} /> Download Report
              </button>
            </div>
          </motion.div>

          {/* ================= RIGHT: CONTENT AREA ================= */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. AI Feedback Section */}
            <motion.div variants={itemVariants} className={`${glassCard} p-8 md:p-10 relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#4ADE80] to-blue-600 opacity-80"></div>
              
              <h3 className="text-xl font-black text-white tracking-tight mb-6 flex items-center gap-3">
                <FileText size={24} className="text-gray-400"/> AI Feedback
              </h3>
              
              <div className="prose prose-invert max-w-none text-gray-400 font-medium leading-relaxed text-sm md:text-base whitespace-pre-line bg-black/30 p-6 rounded-2xl border border-white/5">
                {feedback}
              </div>
            </motion.div>

            {/* 2. Full Conversation Transcript */}
            <motion.div variants={itemVariants} className={`${glassCard} p-6 md:p-8 flex flex-col h-[600px]`}>
              <h3 className="text-xl font-black text-white tracking-tight mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                <MessageSquare size={22} className="text-blue-400"/> Interview Transcript
              </h3>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
                {conversation.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-50">
                     <MessageSquare size={40} className="mb-4 text-gray-500" />
                     <p className="text-sm font-bold uppercase tracking-widest text-gray-400">No Transcript Found</p>
                  </div>
                ) : (
                  conversation.map((msg, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                        key={index} 
                        className={`flex flex-col ${msg.role === "User" ? "items-end" : "items-start"}`}
                    >
                      <div className={`max-w-[85%] p-4 md:p-5 rounded-2xl text-sm md:text-base leading-relaxed ${
                        msg.role === "User" 
                          ? "bg-white/[0.08] border border-white/10 text-white rounded-tr-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                          : "bg-[#0a0a0a] border border-white/5 text-gray-300 rounded-tl-none shadow-inner"
                      }`}>
                        <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 block ${msg.role === "User" ? "text-gray-300" : "text-blue-400"}`}>
                          {msg.role === "User" ? "You" : "MockMate AI"}
                        </span>
                        {msg.message}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

          </div>
        </div>

        {/* ================= BOTTOM ACTIONS ================= */}
        <motion.div variants={itemVariants} className="mt-12 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-8">
          <Link to="/dashboard" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95">
            <Home size={16} /> Home
          </Link>
          <Link to="/setup" className="bg-[#1e1e1e] hover:bg-[#2a2a2a] text-[#4ADE80] border border-[#4ADE80]/30 hover:border-[#4ADE80]/50 shadow-[0_0_15px_rgba(74,222,128,0.1)] px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95">
            <RefreshCw size={16} /> New Interview
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ResultPage;