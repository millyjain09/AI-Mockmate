import React, { useState, useMemo, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Code2, Terminal, Layers, Database, FileJson, ZoomIn, X, Bookmark, Sparkles, Cpu, BookOpen, FileText, DownloadCloud } from "lucide-react";
import axios from "axios"; 
import { useAuth } from "../context/AuthContext"; 
import javapdf from '../assets/java.pdf';

const initialTopics = [
  { id: "dsa", name: "DSA", completed: 0, total: 300, icon: <Code2 size={14}/> },
  { id: "full_stack", name: "Full Stack", completed: 0, total: 150, icon: <Layers size={14}/> },
  { id: "mern", name: "MERN Stack", completed: 0, total: 120, icon: <FileJson size={14}/> },
  { id: "oops", name: "OOPs", completed: 0, total: 50, icon: <BookOpen size={14}/> },
  { id: "dbms", name: "DBMS", completed: 0, total: 100, icon: <Database size={14}/> },
  { id: "python", name: "Python", completed: 0, total: 110, icon: <Terminal size={14}/> },
  { id: "java", name: "Java", completed: 0, total: 150, icon: <Terminal size={14}/> },
  { id: "cpp", name: "C++", completed: 0, total: 100, icon: <Code2 size={14}/> },
  { id: "c", name: "C", completed: 0, total: 60, icon: <Code2 size={14}/> },
  { id: "os", name: "OS", completed: 0, total: 80, icon: <Cpu size={14}/> },
  { id: "HTML", name: "HTML", completed: 0, total: 80, icon: <Cpu size={14}/> },
  { id: "CSS", name: "CSS", completed: 0, total: 80, icon: <Cpu size={14}/> },
  { id: "JS", name: "JS", completed: 0, total: 80, icon: <Cpu size={14}/> },
];

const cheatSheetContent = {
  "DSA": { description: "Complete Data Structures & Algorithms handwritten notes.", pdfUrl: "/pdfs/Dsa.pdf" },
  "OOPs": { description: "Core Object-Oriented Programming concepts and examples.", pdfUrl: "/pdfs/oops.pdf" },
  "MERN Stack": { description: "MongoDB, Express, React, Node.js essential configurations.", pdfUrl: "/pdfs/mern.pdf" },
  "Full Stack": { description: "End-to-end architecture and integrations.", pdfUrl: "/pdfs/mern.pdf" },
  "DBMS": { description: "Database Management Systems & SQL.", pdfUrl: "/pdfs/sql.pdf" },
  "Python": { description: "Advanced Python & Data Science basics.", pdfUrl: "/pdfs/pythonq.pdf" },
  "Java": { description: "Java fundamentals & Collections Framework.", pdfUrl: javapdf },
  "C++": { description: "STL containers and memory management.", pdfUrl: "/pdfs/cpp.pdf" },
  "C": { description: "Low-level system programming.", pdfUrl: "/pdfs/C.pdf" },
  "OS": { description: "Operating Systems concepts.", pdfUrl: "/pdfs/os.pdf" },
  "HTML": { description: "HTML concepts.", pdfUrl: "/pdfs/html.pdf" },
  "CSS": { description: "CSS concepts.", pdfUrl: "/pdfs/css.pdf" },
  "JS": { description: "JS concepts.", pdfUrl: "/pdfs/js.pdf" },
};

const CheatSheets = () => {
  const { user } = useAuth(); 
  
  const [topicsState, setTopicsState] = useState(initialTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeCheatSheet, setActiveCheatSheet] = useState(null); 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loadProgress, setLoadProgress] = useState(0);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const localSavedData = JSON.parse(localStorage.getItem('cheatSheetProgress')) || {};

      if (user?.email) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/${user.email}`);
          const statsData = response.data;
          
          const newTopicsState = initialTopics.map(topic => {
             let dbCompleted = 0;
             if (statsData && statsData.history) {
                 const topicHistory = statsData.history.filter(h => h.topic.toLowerCase() === topic.name.toLowerCase());
                 dbCompleted = topicHistory.length; 
             }
             const finalCompleted = Math.max(dbCompleted, localSavedData[topic.id] || 0);
             return { ...topic, completed: finalCompleted };
          });
          setTopicsState(newTopicsState);
        } catch (error) {
          console.error("Error fetching from DB, falling back to LocalStorage:", error);
          setTopicsState(initialTopics.map(t => ({...t, completed: localSavedData[t.id] || 0})));
        }
      } else {
         setTopicsState(initialTopics.map(t => ({...t, completed: localSavedData[t.id] || 0})));
      }
    };
    fetchProgress();
  }, [user]);

  useEffect(() => {
    let start;
    const duration = 2000; 
    const animate = (time) => {
      if (!start) start = time;
      const elapsed = time - start;
      const p = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - p, 3); 
      setLoadProgress(easeOut);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    let xpTimer;
    if (activeCheatSheet) {
      xpTimer = setInterval(() => {
        setTopicsState((prevTopics) => {
          return prevTopics.map((topic) => {
            if (topic.id === activeCheatSheet.id) {
              const increment = Math.ceil(topic.total * 0.01); 
              const newCompleted = Math.min(topic.completed + increment, topic.total); 

              if (newCompleted !== topic.completed) {
                setActiveCheatSheet(prev => ({...prev, completed: newCompleted}));
                
                const savedData = JSON.parse(localStorage.getItem('cheatSheetProgress')) || {};
                savedData[topic.id] = newCompleted;
                localStorage.setItem('cheatSheetProgress', JSON.stringify(savedData));

                if (user?.email) {
                    axios.post(`http://127.0.0.1:8000/dashboard/update-cheatsheet-progress`, { 
                        email: user.email, 
                        topicId: topic.id, 
                        completed: newCompleted 
                    }).catch(err => console.log("DB sync pending...", err.message));
                }
              }
              return { ...topic, completed: newCompleted };
            }
            return topic;
          });
        });
      }, 120000); 
    }
    return () => clearInterval(xpTimer);
  }, [activeCheatSheet?.id, user]); 

  const filteredTopics = topicsState.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const packedNodes = useMemo(() => {
    const nodes = [];
    const sortedTopics = [...topicsState].sort((a, b) => b.total - a.total);
    
    // 👇 FIX: Bubble size logic adjusted for mobile so they don't look gigantic
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const minR = isMobile ? 35 : 55;
    const maxR = isMobile ? 65 : 100;
    const maxTotal = 300; 

    sortedTopics.forEach((topic) => {
      const r = minR + (Math.min(topic.total, maxTotal) / maxTotal) * (maxR - minR);
      let angle = 0;
      let radiusStep = 0;
      let placed = false;

      while (!placed) {
        const x = Math.cos(angle) * radiusStep;
        const y = Math.sin(angle) * radiusStep;
        let overlap = false;
        
        for (const node of nodes) {
          const dx = node.x - x;
          const dy = node.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < node.r + r + (isMobile ? 5 : 10)) { 
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          nodes.push({ 
              ...topic, 
              x, y, r,
              floatDuration: 3 + Math.random() * 2,
              floatDelay: Math.random() * 2,
              floatY: 5 + Math.random() * 8
          });
          placed = true;
        } else {
          angle += 0.8; 
          radiusStep += 3; 
        }
      }
    });
    return nodes;
  }, [topicsState]); 

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const currentContent = activeCheatSheet ? (cheatSheetContent[activeCheatSheet.name] || {
    description: "Detailed AI cheat sheet for this module is currently being generated.",
    pdfUrl: null
  }) : null;

  const waterDropGlass = "bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.6)]";
  const carvedInput = "w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-black/80 shadow-[inset_0px_2px_10px_rgba(0,0,0,0.8)] transition-all font-medium";

  const parallaxX = (mousePos.x - window.innerWidth / 2) * -0.02;
  const parallaxY = (mousePos.y - window.innerHeight / 2) * -0.02;

  return (
    <div className="min-h-[100dvh] bg-[#020202] text-gray-200 font-sans relative overflow-hidden flex flex-col" onMouseMove={handleMouseMove}>
      
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.02] blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#4ADE80]/[0.02] blur-[150px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative z-10 flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-6 pt-4 md:pt-[120px] pb-28 md:pb-8 flex flex-col h-[100dvh]">
        
        <div className="mb-3 md:mb-6 shrink-0 mt-2">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-4xl font-black text-white tracking-tighter">
                Skill Progression
            </motion.h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 flex-1 min-h-0 overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className={`w-full lg:w-[320px] flex flex-col rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 shrink-0 ${waterDropGlass}`}
            >
                <div className="relative mb-3 md:mb-6">
                    <input 
                        type="text" 
                        placeholder="Search topic..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`${carvedInput} pl-10`}
                    />
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
                
                <div className="flex flex-row md:flex-wrap gap-2.5 overflow-x-auto md:overflow-y-auto custom-scrollbar md:content-start md:flex-1 pb-2">
                    {filteredTopics.map((topic) => (
                        <button 
                            key={topic.id}
                            onClick={() => setActiveCheatSheet(topic)} 
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 border border-white/5 shadow-inner hover:bg-white/[0.08] hover:border-white/20 text-gray-400 hover:text-white transition-all whitespace-nowrap"
                        >
                            <span className="opacity-70">{topic.icon}</span>
                            <span className="text-xs font-bold tracking-wide">{topic.name}</span>
                        </button>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className={`flex-1 relative rounded-3xl md:rounded-[2.5rem] overflow-hidden ${waterDropGlass} border-white/5 bg-[#0a0a0a]/50`}
                ref={canvasRef}
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>
                <div className="absolute top-4 right-4 z-40 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-xl text-gray-400 p-2 rounded-xl border border-white/10 shadow-lg flex items-center gap-1.5">
                      <ZoomIn size={14} />
                      <span className="text-[9px] font-bold uppercase tracking-widest px-1">Pan</span>
                  </div>
                </div>

                <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden">
                  <motion.div 
                    drag 
                    dragConstraints={canvasRef}
                    animate={{ x: parallaxX, y: parallaxY }}
                    transition={{ type: "tween", ease: "easeOut", duration: 0.5 }}
                    className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] flex items-center justify-center"
                  >
                    {packedNodes.map((node) => {
                      const targetPercent = (node.completed / node.total) * 100;
                      const currentPercent = targetPercent * loadProgress;
                      
                      return (
                        <motion.div
                          key={node.id}
                          animate={{ y: [0, -node.floatY, 0] }}
                          transition={{ repeat: Infinity, duration: node.floatDuration, delay: node.floatDelay, ease: "easeInOut" }}
                          style={{
                            width: node.r * 2,
                            height: node.r * 2,
                            left: "50%",
                            top: "50%",
                            marginLeft: node.x - node.r,
                            marginTop: node.y - node.r,
                          }}
                          className="absolute"
                        >
                            <motion.div
                                onMouseEnter={() => setHoveredNode(node)}
                                onMouseLeave={() => setHoveredNode(null)}
                                onClick={() => setActiveCheatSheet(node)} 
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    background: `linear-gradient(to top, #444444 ${currentPercent}%, rgba(255, 255, 255, 0.03) ${currentPercent}%)`,
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.1)'
                                }}
                                className="w-full h-full rounded-full flex flex-col items-center justify-center border border-white/10 cursor-pointer transition-colors"
                            >
                                <span 
                                    className="text-center font-bold text-white px-2 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1"
                                    style={{ fontSize: node.r < 50 ? '11px' : '14px' }}
                                >
                                    {node.name}
                                </span>
                                <span className="text-[9px] font-black text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/5 shadow-inner backdrop-blur-sm">
                                    {Math.round(currentPercent)}%
                                </span>
                            </motion.div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
            </motion.div>
        </div>
      </div>

      {/* ================= FLOATING TOOLTIP ================= */}
      {hoveredNode && !activeCheatSheet && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1 }}
          className="fixed pointer-events-none z-[100] bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-5 py-4 rounded-2xl flex flex-col items-center min-w-[200px]"
          style={{ left: mousePos.x + 20, top: mousePos.y + 20 }}
        >
          <h3 className="text-white font-bold text-base tracking-tight mb-2">{hoveredNode.name}</h3>
          <div className="w-full bg-white/10 h-1.5 rounded-full mb-2 overflow-hidden">
             <div className="bg-[#4ADE80] h-full shadow-[0_0_10px_#4ADE80]" style={{ width: `${(hoveredNode.completed/hoveredNode.total)*100}%` }}></div>
          </div>
          <p className="text-gray-400 font-mono text-xs font-medium bg-white/5 px-3 py-1.5 rounded-md border border-white/5 shadow-inner">
             <span className="text-[#4ADE80] font-bold text-sm">
                 {Math.round((hoveredNode.completed / hoveredNode.total) * 100)}%
             </span> Mastered
          </p>
        </motion.div>
      )}

      {/* ================= FULL-SCREEN PDF VIEWER ================= */}
      <AnimatePresence>
        {activeCheatSheet && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[200] flex flex-col bg-[#0a0a0a] overflow-hidden"
            >
                <div className="flex items-center justify-between px-6 py-4 md:px-8 border-b border-white/10 bg-black/60 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-inner">
                            {activeCheatSheet.icon || <FileText size={20} />}
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-black text-white tracking-tight">{activeCheatSheet.name} Notes</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-widest">
                                    {Math.round((activeCheatSheet.completed/activeCheatSheet.total)*100)}% Progress
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        {currentContent?.pdfUrl && (
                            <a 
                                href={currentContent.pdfUrl} 
                                download 
                                className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                <DownloadCloud size={16} /> Download
                            </a>
                        )}
                        <button 
                            onClick={() => setActiveCheatSheet(null)}
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center text-white hover:text-red-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full h-full bg-[#1e1e1e]">
                    {currentContent?.pdfUrl ? (
                        <iframe
                        src={`${currentContent.pdfUrl}#view=FitH`} 
                       
  
 
                            className="w-full h-full border-none bg-white"
                            title={`${activeCheatSheet.name} PDF Notes`}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-60">
                            <Sparkles size={60} className="mb-6 text-gray-500"/>
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 text-center max-w-md leading-relaxed">
                                {currentContent?.description || "PDF Notes for this module are currently being uploaded by our experts. Check back soon."}
                            </p>
                        </div>
                    )}
                </div>

                {currentContent?.pdfUrl && (
                    <div className="md:hidden p-4 border-t border-white/10 bg-black shrink-0">
                        <a 
                            href={currentContent.pdfUrl} 
                            download 
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-white text-black rounded-xl text-sm font-black uppercase tracking-widest active:scale-95"
                        >
                            <DownloadCloud size={18} /> Download PDF
                        </a>
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CheatSheets;
