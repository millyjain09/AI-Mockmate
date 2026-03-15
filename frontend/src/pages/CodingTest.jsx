import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import { Play, Clock, Save, Award, Code2, Terminal, Cpu, CheckCircle, RotateCcw, Loader, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const CodingTest = () => {
  const { user } = useAuth(); 
  
  // --- STATES (UNTOUCHED LOGIC) ---
  const [stage, setStage] = useState("setup"); 
  const [level, setLevel] = useState("Fresher");
  
  const [mobileTab, setMobileTab] = useState("question"); 
  
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  const [userAnswers, setUserAnswers] = useState({});
  const [globalLang, setGlobalLang] = useState("cpp"); 
  
  const [timeLeft, setTimeLeft] = useState(1200);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  // Default to dark theme for the overall aesthetic
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [processing, setProcessing] = useState(false);

  // Theme Sync - Forced to Dark for this specific monochrome aesthetic
  useEffect(() => {
    document.documentElement.classList.add("dark");
    setEditorTheme("vs-dark");
  }, []);

  // Timer (UNTOUCHED)
  useEffect(() => {
    let timer;
    if (stage === "test" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && stage === "test") {
      finishExam();
    }
    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  // --- 1. GENERATE QUESTIONS (UNTOUCHED LOGIC) ---
  const generateInterview = async () => {
    setStage("loading");

    try {
        const res = await axios.post("http://127.0.0.1:8000/code/generate-questions", { 
            level: level,
            count: 3
        });
        setupExam(res.data.questions);
    } catch (error) {
        // Fallback Data
        const fallbackData = [
            { 
                id: 101, title: "Two Sum", desc: "Find indices of two numbers that add up to target.", example: "Input: [2,7,11,15], 9 \nOutput: [0,1]", 
                templates: { cpp: "// Code here", javascript: "// Code here", python: "# Code here", java: "// Code here" } 
            }
        ];
        setupExam(fallbackData);
    }
  };

  const setupExam = (questions) => {
    setExamQuestions(questions);
    const initialAnswers = {};
    questions.forEach(q => {
        initialAnswers[q.id] = { 
            code: q.templates?.[globalLang] || `// Write your ${globalLang} code here...`, 
            lang: globalLang, 
            status: "Pending", 
            output: "" 
        };
    });
    setUserAnswers(initialAnswers);
    setTimeLeft(level === "Senior" ? 2700 : 1200);
    setStage("test");
  };

  // --- 2. HANDLERS (UNTOUCHED LOGIC) ---
  const handleLanguageChange = (newLang) => {
    setGlobalLang(newLang);
    if (!examQuestions[currentQIndex]) return;

    const currentQ = examQuestions[currentQIndex];
    const newTemplate = currentQ.templates?.[newLang] || `// Write ${newLang} code here...`;
    
    setUserAnswers(prev => ({
        ...prev,
        [currentQ.id]: { ...prev[currentQ.id], code: newTemplate, lang: newLang }
    }));
  };

  const handleCodeChange = (val) => {
    const currentQ = examQuestions[currentQIndex];
    setUserAnswers(prev => ({
        ...prev,
        [currentQ.id]: { ...prev[currentQ.id], code: val }
    }));
  };

  const runCode = async () => {
    setProcessing(true);
    const currentQ = examQuestions[currentQIndex];
    const answerData = userAnswers[currentQ.id];

    try {
      const formData = new FormData();
      formData.append("code", answerData.code);
      formData.append("language", answerData.lang);
      formData.append("question", currentQ.desc);

      const res = await axios.post("http://127.0.0.1:8000/code/submit", formData);
      const resultText = res.data.result;
      let status = resultText.includes("STATUS: PASSED") ? "Passed" : "Failed";

      setUserAnswers(prev => ({
        ...prev,
        [currentQ.id]: { ...prev[currentQ.id], status: status, output: resultText }
      }));
    } catch (error) {
        setUserAnswers(prev => ({
            ...prev,
            [currentQ.id]: { ...prev[currentQ.id], output: "Server Connection Error" }
        }));
    }
    setProcessing(false);
  };

  const finishExam = async () => {
    const passed = Object.values(userAnswers).filter(a => a.status === 'Passed').length;
    const total = examQuestions.length;
    const score = total === 0 ? 0 : Math.round((passed / total) * 100);
    
    setTotalTimeTaken(1200 - timeLeft); // Note: Might need adjustment if level is Senior (2700s)
    setStage("result");

    if (user?.email) {
        try {
            await axios.post("http://127.0.0.1:8000/dashboard/save", {
                email: user.email,
                type: "coding",
                topic: `DSA Challenge (${level})`,
                score: score,
                date: new Date().toISOString().split('T')[0] 
            });
            alert("Result Saved to Dashboard!");
        } catch (err) {
            console.error("Save failed:", err);
            alert("Error saving result.");
        }
    } else {
        alert("Warning: You are not logged in. Result will not be saved.");
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const calculateScore = () => {
      const passed = Object.values(userAnswers).filter(a => a.status === 'Passed').length;
      const total = examQuestions.length;
      if (total === 0) return 0;
      return Math.round((passed / total) * 100);
  };

  // --- REUSABLE GLASS CSS ---
  const waterDropGlass = "bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.6)]";
  
  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/5 blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gray-500/5 blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      {/* --- STAGE 1: SETUP --- */}
      {stage === "setup" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 mt-16 md:mt-20">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-white mb-6 shadow-sm">
                    <Code2 size={14} /> AI Assessment Mode
                </span>
                <h1 className="text-4xl md:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter">
                   Coding Interview Simulator
                </h1>
                <p className="text-gray-400 text-sm md:text-base font-medium">Select your experience level to begin the algorithmic challenge.</p>
            </motion.div>
            
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mb-12">
                {['Fresher', 'Mid', 'Senior'].map((lvl, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                        key={lvl} onClick={() => setLevel(lvl)}
                        className={`cursor-pointer flex-1 p-8 rounded-[2rem] transition-all duration-300 relative group overflow-hidden
                        ${level === lvl 
                            ? "bg-white/10 border border-white/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_10px_20px_rgba(0,0,0,0.5)]" 
                            : "bg-black/40 border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] hover:bg-white/5 hover:border-white/20"}`}
                    >
                        {level === lvl && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>}
                        
                        <div className={`mb-6 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto transition-colors duration-300 relative z-10 border
                            ${level === lvl ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-white/5 border-white/10 text-gray-400 group-hover:text-white"}`}>
                             <Cpu size={24}/>
                        </div>
                        <h3 className={`font-bold text-2xl mb-2 text-center transition-colors relative z-10 ${level === lvl ? "text-white" : "text-gray-300"}`}>{lvl}</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center relative z-10">
                            {lvl === 'Fresher' ? 'Easy • 20 Mins' : lvl === 'Mid' ? 'Medium • 30 Mins' : 'Hard • 45 Mins'}
                        </p>
                        {level === lvl && <div className="absolute top-6 right-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"><CheckCircle size={20}/></div>}
                    </motion.div>
                ))}
            </div>
            
            <motion.button 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                onClick={generateInterview} 
                className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.5)] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all duration-300 active:scale-95 flex items-center gap-3"
            >
                <Sparkles size={16} fill="currentColor"/> Generate Interview
            </motion.button>
        </div>
      )}

      {/* --- STAGE 2: LOADING --- */}
      {stage === "loading" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
              <div className="p-6 bg-white/5 rounded-full border border-white/10 shadow-lg mb-6">
                <Loader size={40} className="text-white animate-spin"/>
              </div>
              <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Compiling Assessment</h2>
              <p className="text-gray-500 font-medium text-sm">Connecting to secure AI backend...</p>
          </div>
      )}

      {/* --- STAGE 3: TEST AREA --- */}
      {stage === "test" && examQuestions.length > 0 && (
        <div className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden relative z-10 mt-16 md:mt-24 pb-4 px-2 md:px-6">
            
            {/* MOBILE TABS (Glass style) */}
            <div className="md:hidden flex rounded-2xl p-1 mb-2 bg-black/50 border border-white/10 backdrop-blur-md shrink-0 shadow-inner mx-2">
                <button 
                    onClick={() => setMobileTab('question')}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all ${
                        mobileTab === 'question' 
                        ? 'bg-white/10 text-white shadow-sm border border-white/5' 
                        : 'text-gray-500'
                    }`}
                >
                    <BookOpen size={14}/> Problem
                </button>
                <button 
                    onClick={() => setMobileTab('code')}
                    className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl transition-all ${
                        mobileTab === 'code' 
                        ? 'bg-white/10 text-white shadow-sm border border-white/5' 
                        : 'text-gray-500'
                    }`}
                >
                    <Code2 size={14}/> Editor
                </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className={`flex-1 flex flex-col md:flex-row gap-4 overflow-hidden ${waterDropGlass} md:p-1 rounded-[2rem]`}>
                
                {/* LEFT: Question Panel */}
                <div className={`w-full md:w-[400px] lg:w-[450px] flex flex-col bg-black/40 rounded-[1.5rem] border border-white/5 overflow-hidden
                    ${mobileTab === 'question' ? 'flex' : 'hidden md:flex'}
                `}>
                    {/* Header Top Bar */}
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-5 bg-white/[0.02]">
                        <div className="flex gap-2">
                            {examQuestions.map((_, idx) => (
                                <button key={idx} onClick={() => setCurrentQIndex(idx)}
                                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all border
                                    ${currentQIndex === idx 
                                        ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]" 
                                        : userAnswers[examQuestions[idx].id]?.status === 'Passed'
                                            ? "bg-white/10 text-gray-300 border-white/20 shadow-inner"
                                            : "bg-black/50 text-gray-500 border-white/5 hover:bg-white/5"
                                    }`}>
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                        <div className="text-xs font-mono font-bold text-white flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg shadow-inner tracking-wider">
                            <Clock size={14} className="text-gray-400"/> {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-black tracking-tight text-white">{examQuestions[currentQIndex].title}</h2>
                            <span className="text-[10px] font-black px-2.5 py-1 bg-white/5 rounded-md text-gray-400 border border-white/10 uppercase tracking-widest">
                                {level}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-8 leading-relaxed font-medium">
                            {examQuestions[currentQIndex].desc}
                        </p>
                        
                        <div className="bg-black/60 p-5 rounded-2xl border border-white/5 mb-6 shadow-inner relative overflow-hidden">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Terminal size={12}/> Example Case</h3>
                            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed relative z-10">
                                {examQuestions[currentQIndex].example}
                            </pre>
                        </div>

                        {/* Execution Console inside Question Panel */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                             <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Terminal size={12}/> Execution Console</h3>
                             <div className={`p-5 rounded-2xl text-xs font-mono min-h-[100px] border transition-colors overflow-x-auto shadow-inner ${
                                 userAnswers[examQuestions[currentQIndex].id]?.status === "Passed" 
                                 ? "bg-white/5 border-white/20 text-gray-200"
                                 : "bg-black/80 border-white/5 text-gray-500"
                             }`}>
                                 {processing ? (
                                    <span className="flex items-center gap-2 text-white animate-pulse"><Loader size={14} className="animate-spin"/> Executing program...</span>
                                 ) : (
                                    userAnswers[examQuestions[currentQIndex].id]?.output || "Awaiting execution..."
                                 )}
                             </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Editor Area */}
                <div className={`flex-1 flex-col bg-[#050505] rounded-[1.5rem] border border-white/5 overflow-hidden min-w-0 shadow-inner
                    ${mobileTab === 'code' ? 'flex' : 'hidden md:flex'}
                `}>
                    {/* Editor Top Bar */}
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-5 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <Code2 size={16} className="text-gray-400 hidden md:block"/>
                            <select value={globalLang} onChange={(e) => handleLanguageChange(e.target.value)} className="bg-black/50 border border-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-lg px-3 py-1.5 outline-none focus:border-white/30 cursor-pointer appearance-none">
                                <option value="cpp">C++</option>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={runCode} disabled={processing} className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all border border-white/10">
                                <Play size={12} fill="currentColor"/> <span className="hidden sm:inline">Run</span>
                            </button>
                            <button onClick={finishExam} className="flex items-center gap-2 px-4 py-1.5 bg-white text-black hover:bg-gray-200 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                <Save size={12}/> <span className="hidden sm:inline">Submit</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Monaco Editor Container */}
                    <div className="flex-1 relative bg-[#050505] pt-2">
                        <Editor 
                            height="100%" 
                            theme={editorTheme} 
                            language={globalLang} 
                            value={userAnswers[examQuestions[currentQIndex]?.id]?.code || ""} 
                            onChange={handleCodeChange} 
                            options={{ 
                                fontSize: 14, 
                                fontFamily: "'Fira Code', 'JetBrains Mono', monospace", 
                                minimap: { enabled: false }, 
                                padding: { top: 16, bottom: 16 }, 
                                automaticLayout: true, 
                                scrollBeyondLastLine: false, 
                                lineNumbersMinChars: 3, 
                                renderLineHighlight: "all",
                                scrollbar: { verticalScrollbarSize: 8 }
                            }} 
                        />
                    </div>
                </div>

            </div>
        </div>
      )}

      {/* --- STAGE 4: RESULT --- */}
      {stage === "result" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 mt-20">
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`${waterDropGlass} p-8 md:p-12 rounded-[2.5rem] max-w-md w-full text-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
                
                <div className="w-24 h-24 bg-white/10 border border-white/20 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)] relative">
                    <div className="absolute inset-0 bg-white/20 animate-ping rounded-[2rem] opacity-20"></div>
                    <Award size={48} strokeWidth={1.5}/>
                </div>
                
                <h2 className="text-3xl font-black mb-2 text-white tracking-tighter">Assessment Complete</h2>
                <p className="text-gray-400 text-sm font-medium mb-10">Telemetry data successfully synced to dashboard.</p>
                
                <div className="flex justify-center gap-4 mb-10">
                    <div className="flex-1 bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Duration</p>
                        <p className="text-2xl font-mono font-bold text-white">{formatTime(totalTimeTaken)}</p>
                    </div>
                    <div className="flex-1 bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Final Score</p>
                        <p className="text-3xl font-black text-white">{calculateScore()}%</p>
                    </div>
                </div>
                
                <button onClick={() => window.location.href = "/dashboard"} className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-gray-200 active:scale-95">
                    <RotateCcw size={16}/> Return to Dashboard
                </button>
             </motion.div>
        </div>
      )}
    </div>
  );
};

export default CodingTest;