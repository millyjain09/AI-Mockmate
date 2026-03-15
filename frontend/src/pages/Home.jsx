import React from "react";
import Navbar from "../components/Navbar";
import FloatingLines from "../components/FloatingLines"; 
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Video, BarChart3, ShieldCheck, Zap, ArrowRight, Sparkles, FileText, Crosshair, Cpu, CheckCircle2 } from "lucide-react";

const Home = () => {
  // Reusable Water Drop Glass CSS for consistency
  const waterDropGlass = "bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4)]";
  
  // Slightly brighter variant for Primary Button
  const primaryWaterDrop = "bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6),inset_0px_-1px_2px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.6)]";

  return (
    // MAIN WRAPPER: Pure Black & White Selection
    <div className="min-h-screen font-sans selection:bg-white selection:text-black text-gray-100 bg-black overflow-x-hidden flex flex-col relative">
      
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* --- MONOCHROME BACKGROUND EFFECTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Soft Grey Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gray-900/40 blur-[130px] mix-blend-screen animate-pulse duration-[10s] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gray-800/20 blur-[140px] mix-blend-screen pointer-events-none"></div>

        {/* Floating Lines: Grey/White Gradient */}
        <FloatingLines 
          enabledWaves={["top","middle","bottom"]}
          lineCount={6}
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          linesGradient={['#ffffff', '#444444', '#000000']} 
        />
        
        {/* Subtle Grid - Darker Grey */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
      </div>

      {/* ================= 1. HERO SECTION ================= */}
      <div className="relative z-10 min-h-[90vh] flex items-center justify-center px-6 pt-20 pointer-events-none">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center pointer-events-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className={`${waterDropGlass} text-gray-300 rounded-full px-5 py-2 text-xs font-bold tracking-widest flex items-center gap-2 mb-8 uppercase`}
          >
            <Sparkles size={14} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            The Future of Interview Prep
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.1] mb-6 text-white"
          >
            Master your interviews <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-600">
              with AI confidence.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed"
          >
            Real-time AI mock interviews, eye-contact tracking, and instant voice analysis. Don't just practice, perfect your pitch with data-driven insights.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
          >
            <Link to="/setup" className="w-full sm:w-auto">
              <button className={`${primaryWaterDrop} w-full sm:w-auto text-white px-10 py-4 rounded-full text-sm font-black hover:bg-white/[0.15] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2`}>
                Start Interview <ArrowRight size={16} />
              </button>
            </Link>
            
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className={`${waterDropGlass} w-full sm:w-auto text-gray-300 px-10 py-4 rounded-full text-sm font-bold hover:bg-white/[0.08] hover:text-white transition-all duration-300 active:scale-95`}>
                View Dashboard
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ================= 2. INFINITE MARQUEE ================= */}
      <div className="relative z-10 py-16 border-y border-white/5 bg-white/[0.01] backdrop-blur-xl overflow-hidden">
        <p className="text-center text-[10px] font-bold text-gray-600 mb-10 uppercase tracking-[0.4em]">
          Practice standards from global tech giants
        </p>
        
        <div className="flex whitespace-nowrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-24 items-center shrink-0 pr-24 text-3xl md:text-5xl font-black text-[#1a1a1a] tracking-tighter"
          >
            <span className="hover:text-gray-600 transition-colors cursor-default">GOOGLE</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">AMAZON</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">MICROSOFT</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">META</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">NETFLIX</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">APPLE</span>
            
            <span className="hover:text-gray-600 transition-colors cursor-default">GOOGLE</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">AMAZON</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">MICROSOFT</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">META</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">NETFLIX</span>
            <span className="hover:text-gray-600 transition-colors cursor-default">APPLE</span>
          </motion.div>
        </div>
      </div>

      {/* ================= 3. NEW SECTION: HOW IT WORKS ================= */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4">The Protocol</h2>
            <p className="text-gray-500 font-medium">Three steps to achieving interview perfection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center px-6">
               <div className="w-20 h-20 mx-auto bg-white/[0.03] rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-lg text-gray-400">
                  <Crosshair size={32} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">1. Calibrate</h3>
               <p className="text-gray-500 text-sm leading-relaxed">Upload your resume and select your target role. The AI tailors questions to your exact tech stack.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-center px-6">
               <div className="w-20 h-20 mx-auto bg-white/[0.03] rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-lg text-gray-400">
                  <Cpu size={32} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">2. Simulate</h3>
               <p className="text-gray-500 text-sm leading-relaxed">Enter the immersive glass-room. Face real-time voice, video, and coding challenges under pressure.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-center px-6">
               <div className="w-20 h-20 mx-auto bg-white/[0.03] rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-lg text-gray-400">
                  <CheckCircle2 size={32} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">3. Analyze</h3>
               <p className="text-gray-500 text-sm leading-relaxed">Receive instant telemetry. Get grammar correction, confidence scoring, and logic evaluation.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= 4. NEW SECTION: METRICS/STATS ================= */}
      <div className="relative z-10 py-16 border-y border-white/5 bg-white/[0.01] backdrop-blur-md my-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">10k+</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Interviews Simulated</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">98%</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Confidence Boost</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">50+</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tech Roles</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">24/7</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AI Availability</p>
            </div>
        </div>
      </div>

      {/* ================= 5. FEATURE GRID (Now 6 Cards) ================= */}
      <div className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tighter"
          >
            Why MockMate?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 mt-4 text-xs font-bold uppercase tracking-[0.3em]"
          >
            System Capabilities
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              delay={0.1}
              icon={<Bot size={24}/>}
              title="Conversational AI"
              desc="Adaptive questions based on your resume. Feels exactly like talking to a real human HR."
            />
            <FeatureCard 
              delay={0.2}
              icon={<ShieldCheck size={24}/>}
              title="Anti-Cheat System"
              desc="Smart tab-switch detection and eye-contact monitoring to ensure a genuine practice environment."
            />
            <FeatureCard 
              delay={0.3}
              icon={<BarChart3 size={24}/>}
              title="Deep Analytics"
              desc="Get highly detailed scorecards, grammar checks, and improvement tips after every session."
            />
            <FeatureCard 
              delay={0.4}
              icon={<Video size={24}/>}
              title="Video & Voice"
              desc="Lightning-fast real-time speech-to-text and text-to-speech for a seamless conversation."
            />
            <FeatureCard 
              delay={0.5}
              icon={<FileText size={24}/>}
              title="Context Injection"
              desc="Upload your PDF resume. The AI parses your projects and history to ask hyper-personalized questions."
            />
            <FeatureCard 
              delay={0.6}
              icon={<Zap size={24}/>}
              title="Instant Results"
              desc="No waiting around. Get your comprehensive performance report the moment you finish."
            />
          </div>
        </div>
      </div>

      {/* ================= 6. NEW SECTION: BOTTOM CTA ================= */}
      <div className="relative z-10 pb-20 px-6">
         <motion.div 
           initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
           className={`max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden ${waterDropGlass}`}
         >
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 relative z-10">Ready to secure the offer?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto font-medium relative z-10">
                Stop guessing. Start practicing with the most advanced AI interview simulator available today.
            </p>
            
            <Link to="/setup" className="relative z-10 inline-block">
              <button className={`${primaryWaterDrop} text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-white/[0.15] transition-all duration-300 active:scale-95 flex items-center justify-center gap-3`}>
                Begin Protocol
              </button>
            </Link>
         </motion.div>
      </div>

      {/* --- FLOATING GLASS FOOTER --- */}
      <footer className={`relative z-20 ${waterDropGlass} mx-6 mb-8 rounded-[2.5rem] py-8 text-center text-gray-400`}>
        <div className="flex justify-center items-center gap-2 mb-3 opacity-50">
           <Sparkles size={14} />
           <span className="font-bold text-white tracking-tighter uppercase italic text-sm">MockMate</span>
        </div>
        <p className="text-[10px] font-black tracking-[0.5em] uppercase text-gray-500">© 2026 Global Standards.</p>
      </footer>
    </div>
  );
};

// WATER DROP FEATURE CARD
const FeatureCard = ({ icon, title, desc, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5 }}
      // Card Container gets a subtle frosted glass feel
      className="relative w-full bg-white/[0.01] backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.03] transition-all flex flex-col group overflow-hidden"
    >
      <div className="relative z-10">
        {/* ICON BOX: The Water Drop Glass Effect */}
        <div className="bg-white/[0.03] backdrop-blur-xl w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.5)] text-gray-400 group-hover:text-white group-hover:bg-white/[0.08] transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm font-medium">{desc}</p>
      </div>
    </motion.div>
  );
};

export default Home;