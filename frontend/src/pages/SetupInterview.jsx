import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
// BUG FIX: Strictly using your original working icons (UploadCloud) to prevent crashes
import { UploadCloud, Play, BookOpen, Clock, Settings, Briefcase, FileText, Star } from "lucide-react";
import { motion } from "framer-motion";

const SetupInterview = () => {
  const navigate = useNavigate();
  
  // --- STATES (UNTOUCHED LOGIC) ---
  const [topic, setTopic] = useState("React JS");
  const [level, setLevel] = useState("Fresher");
  const [mode, setMode] = useState("practice"); 
  const [totalQuestions, setTotalQuestions] = useState(5); 
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return; 
    
    setResume(file);
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://127.0.0.1:8000/interview/upload-resume", formData);
      alert("Resume Uploaded & Analyzed! ✅");
    } catch (error) {
      alert("Resume upload failed.");
      console.error(error);
      setResume(null); 
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  const startInterview = () => {
    localStorage.setItem("interviewConfig", JSON.stringify({ 
        topic, 
        level, 
        mode, 
        totalQuestions 
    }));
    navigate("/interview-room");
  };

  // --- REUSABLE GLASS CSS ---
  const waterDropGlass = "bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.6)]";
  const carvedInput = "w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:bg-black/80 shadow-[inset_0px_2px_10px_rgba(0,0,0,0.8)] transition-all font-medium appearance-none";

  return (
    // MAIN WRAPPER
    <div className="min-h-screen bg-[#020202] text-gray-200 font-sans relative overflow-x-hidden flex flex-col">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.03] blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gray-500/[0.03] blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>
      
      {/* BUG FIX: Added extra padding top (pt-[140px]) so it doesn't hide behind the smart navbar */}
      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 pt-[140px] pb-16">
        
        {/* HEADER */}
        <div className="mb-12 text-center md:text-left">
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 shadow-sm">
               <Settings size={14} /> Configuration
           </motion.div>
           <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter mb-4">
               Setup Your Interview
           </motion.h1>
           <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 font-medium text-sm md:text-base">
               Calibrate the AI to match your specific career goals and experience level.
           </motion.p>
        </div>

        {/* MAIN CONFIGURATION GRID */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`p-6 md:p-10 rounded-[2.5rem] ${waterDropGlass} grid md:grid-cols-2 gap-10 md:gap-16`}
        >
          
          {/* --- LEFT COLUMN --- */}
          <div className="space-y-8">
            
            {/* 1. Topic */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                 <Briefcase size={14}/> Target Role / Topic
              </label>
              <div className="relative group">
                  <input 
                    type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                    className={`${carvedInput} pl-12`}
                    placeholder="e.g. React JS, Data Science..."
                  />
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
              </div>
            </div>

            {/* 2. Level */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                 <Star size={14}/> Difficulty Level
              </label>
              <div className="relative group">
                  <select 
                    value={level} onChange={(e) => setLevel(e.target.value)}
                    className={`${carvedInput} cursor-pointer`}
                  >
                    <option value="Intern" className="bg-[#111] text-white">Intern (Student)</option>
                    <option value="Fresher" className="bg-[#111] text-white">Fresher (0-1 yr)</option>
                    <option value="Experienced" className="bg-[#111] text-white">Experienced (2+ yrs)</option>
                    <option value="Managerial" className="bg-[#111] text-white">Managerial</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-white transition-colors text-xs">▼</div>
              </div>
            </div>

            {/* 3. Resume Upload */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                  <FileText size={14}/> Context Injection
              </label>
              <div className="relative overflow-hidden group border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-white/30 bg-black/40 hover:bg-white/[0.02] transition-all cursor-pointer shadow-[inset_0px_2px_10px_rgba(0,0,0,0.5)]">
                <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                
                <div className="relative z-0 flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-white/[0.05] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                       {uploading ? <UploadCloud className="text-white animate-bounce" size={24} /> : <UploadCloud className="text-gray-400 group-hover:text-white transition-colors" size={24} />}
                    </div>
                    <p className="text-sm text-gray-300 font-bold tracking-wide">
                        {uploading ? "Analyzing document..." : (resume ? resume.name : "Upload PDF Resume")}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-widest">
                        {resume ? "Ready for tailored questions" : "Optional: For personalized questions"}
                    </p>
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="space-y-8">
            
            {/* 4. Question Count */}
            <div>
              <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                 <Clock size={14}/> Duration Parameters
              </label>
              <div className="relative group">
                  <select 
                    value={totalQuestions} 
                    onChange={(e) => setTotalQuestions(e.target.value)}
                    className={`${carvedInput} cursor-pointer`}
                  >
                    <option value="3" className="bg-[#111] text-white">3 Questions (Quick - 5 Mins)</option>
                    <option value="5" className="bg-[#111] text-white">5 Questions (Standard - 10 Mins)</option>
                    <option value="10" className="bg-[#111] text-white">10 Questions (Deep Dive - 20 Mins)</option>
                    <option value="15" className="bg-[#111] text-white">15 Questions (Full Mock)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 group-focus-within:text-white transition-colors text-xs">▼</div>
              </div>
            </div>

            {/* 5. Mode Selection */}
            <div>
                <label className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    Select Mode
                </label>
                <div className="grid grid-cols-1 gap-4">
                    
                    {/* Practice Mode */}
                    <div 
                        onClick={() => setMode("practice")}
                        className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-5 overflow-hidden group
                        ${mode === "practice" 
                            ? "bg-white/[0.08] border border-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_10px_20px_rgba(0,0,0,0.5)]" 
                            : "bg-black/40 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] hover:bg-white/[0.02] hover:border-white/10"}`}
                    >
                        {mode === "practice" && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>}
                        
                        <div className={`p-3.5 rounded-xl border transition-colors duration-300 relative z-10
                            ${mode === "practice" ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-white/[0.05] border-white/10 text-gray-500 group-hover:text-gray-300"}`}>
                            <BookOpen size={20}/>
                        </div>
                        <div className="relative z-10">
                            <h3 className={`font-bold tracking-tight mb-0.5 transition-colors ${mode === "practice" ? "text-white text-lg" : "text-gray-400 text-base"}`}>Training Mode</h3>
                            <p className="text-gray-500 text-[11px] font-medium leading-relaxed max-w-[250px]">Real-time feedback after every answer. Best for skill building.</p>
                        </div>
                    </div>

                    {/* Mock Mode */}
                    <div 
                        onClick={() => setMode("mock")}
                        className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-5 overflow-hidden group
                        ${mode === "mock" 
                            ? "bg-white/[0.08] border border-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_10px_20px_rgba(0,0,0,0.5)]" 
                            : "bg-black/40 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] hover:bg-white/[0.02] hover:border-white/10"}`}
                    >
                        {mode === "mock" && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>}
                        
                        <div className={`p-3.5 rounded-xl border transition-colors duration-300 relative z-10
                            ${mode === "mock" ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-white/[0.05] border-white/10 text-gray-500 group-hover:text-gray-300"}`}>
                            <Play size={20} className="ml-0.5"/>
                        </div>
                        <div className="relative z-10">
                            <h3 className={`font-bold tracking-tight mb-0.5 transition-colors ${mode === "mock" ? "text-white text-lg" : "text-gray-400 text-base"}`}>Simulation Mode</h3>
                            <p className="text-gray-500 text-[11px] font-medium leading-relaxed max-w-[250px]">No interruptions. Continuous flow with a final scorecard at the end.</p>
                        </div>
                    </div>

                </div>
            </div>

          </div>
        </motion.div>

        {/* --- BOTTOM ACTION --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex justify-end">
            <button 
                onClick={startInterview}
                className="w-full md:w-auto bg-white/[0.1] backdrop-blur-2xl border border-white/20 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6),inset_0px_-1px_2px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.5)] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white/[0.15] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 group"
            >
                Initialize Protocol
                <Play size={16} className="group-hover:translate-x-1 transition-transform" fill="currentColor"/>
            </button>
        </motion.div>

      </div>
    </div>
  );
};

export default SetupInterview;