import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 
import Navbar from "../components/Navbar";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Play, TrendingUp, Clock, Code, Video, Mic, ArrowRight, ArrowUpRight, ArrowDownRight, Zap, BookOpen, Users, Sparkles 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const Dashboard = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    total_sessions: 0,
    average_score: 0,
    weekly_growth: 0,
    streak: 0,
    history: [] 
  });

  useEffect(() => {
    if (user === null) {
        navigate("/login"); 
        return; 
    }
    
    if (user === undefined) return; 

    const fetchStats = async () => {
      if (user?.email) {
        try {
        const res = await axios.get(`${API_URL}/dashboard/stats/${user.email}`);
          if (res.data) setStats(res.data);
        } catch (err) { 
          console.error("Error fetching stats:", err);
        } finally { 
          setLoading(false); 
        }
      }
    };
    
    fetchStats();
  }, [user, navigate]);

  const getDisplayName = () => user?.username || user?.email?.split("@")[0] || "Developer";

  // Graph Data Helper
  const graphData = stats.history.length > 0 
    ? stats.history.slice(0, 7).reverse().map(h => ({
        date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: h.score,
        type: h.type
      }))
    : [{ date: 'Start', score: 0 }];

  // ================= 🔴 CUSTOM DOTTED LOADER =================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
           <div className="w-[40vw] h-[40vw] bg-white/[0.02] blur-[120px] rounded-full animate-pulse duration-1000"></div>
        </div>
        
        <div className="relative flex flex-col items-center justify-center z-10">
          <div className="w-16 h-16 animate-[spin_2.5s_linear_infinite]">
            <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 20 50 A 30 30 0 0 0 80 50"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="1 10" 
                className="animate-pulse"
              />
            </svg>
          </div>
          <p className="mt-6 text-gray-400 font-medium tracking-[0.3em] uppercase text-xs animate-pulse">loading</p>
        </div>
      </div>
    );
  }

  // ================= REUSABLE WATER BUBBLE CSS =================
  const waterBubbleGlass = "bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0px_2px_4px_rgba(255,255,255,0.3),inset_0px_-2px_4px_rgba(0,0,0,0.5),0_10px_30px_rgba(0,0,0,0.6)]";
  const waterDropIcon = "bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6),inset_0px_-1px_2px_rgba(0,0,0,0.5)]";

  return (
    // MAIN WRAPPER
    <div className="min-h-screen bg-[#020202] text-gray-200 font-sans relative overflow-x-hidden flex flex-col">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/[0.03] blur-[140px] animate-pulse duration-[10s]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gray-500/[0.04] blur-[120px]"></div>
         {/* Dot Grid Mask */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 pt-1 md:pt-[100px] pb-16 md:pb-16">
        
        {/* --- WELCOME HEADER --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter">
              Welcome, <span className="capitalize text-white">{getDisplayName()}</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-medium">
               Weekly performance growth is at <span className="text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">+{stats.weekly_growth}%</span>.
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className={`${waterDropIcon} px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/[0.08] transition-colors cursor-default`}>
                <Zap size={16} className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] animate-pulse" />
                <span className="font-black text-xs uppercase tracking-widest text-white">{stats.streak} Day Streak</span>
             </div>
          </div>
        </motion.div>

        {/* --- STATS GRID (Water Bubbles) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatsCard title="Total Sessions" value={stats.total_sessions} icon={<Clock size={20}/>} trend="+3 this week" trendUp={true} waterBubbleGlass={waterBubbleGlass} waterDropIcon={waterDropIcon} />
            <StatsCard title="Average Score" value={`${stats.average_score}%`} icon={<TrendingUp size={20}/>} trend={`${stats.weekly_growth}% growth`} trendUp={stats.weekly_growth >= 0} waterBubbleGlass={waterBubbleGlass} waterDropIcon={waterDropIcon} />
            <StatsCard title="Coding Solved" value={stats.history.filter(h => h.type === 'coding').length} icon={<Code size={20}/>} trend="Consistent" trendUp={true} waterBubbleGlass={waterBubbleGlass} waterDropIcon={waterDropIcon} />
            <StatsCard title="Mock Interviews" value={stats.history.filter(h => h.type === 'interview' || h.type === 'english').length} icon={<Users size={20}/>} trend="Active" trendUp={true} waterBubbleGlass={waterBubbleGlass} waterDropIcon={waterDropIcon} />
        </div>

        {/* --- MAIN DASHBOARD CONTENT (2 Columns) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Performance Graph (Deep Glass Panel) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`lg:col-span-2 ${waterBubbleGlass} rounded-[2.5rem] p-6 md:p-8 flex flex-col`}
          >
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white tracking-tight">Performance Analytics</h2>
                <select className="bg-black/60 backdrop-blur-xl text-white font-bold tracking-widest uppercase border border-white/10 rounded-full text-[10px] px-5 py-2.5 outline-none cursor-pointer focus:border-white/30 transition-colors shadow-inner appearance-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>
            
            <div className="h-[300px] w-full mt-auto">
              {stats.total_sessions > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={graphData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.1} />
                      <XAxis dataKey="date" stroke="#666" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#666" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '1rem', fontSize: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }} 
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }}
                      />
                      <ReferenceLine y={80} stroke="#ffffff" strokeDasharray="4 4" opacity={0.2} />
                      <Area type="monotone" dataKey="score" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, fill: '#000', stroke: '#fff', strokeWidth: 3, shadow: '0 0 10px #fff' }} />
                    </AreaChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-3xl bg-black/40 shadow-inner">
                      <Sparkles size={32} className="mb-4 opacity-50" />
                      <p className="text-xs font-bold uppercase tracking-widest">No Data Available</p>
                  </div>
              )}
            </div>
          </motion.div>

          {/* Activity History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`${waterBubbleGlass} rounded-[2.5rem] p-6 md:p-8 flex flex-col h-[400px] lg:h-auto`}
          >
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
                <Link to="/dashboard" className="text-[10px] font-black text-white hover:text-gray-300 transition-colors uppercase tracking-widest bg-white/10 border border-white/10 px-4 py-2 rounded-full shadow-inner">View All</Link>
             </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {stats.history.length > 0 ? (
                    stats.history.slice(0, 6).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors group cursor-default shadow-inner">
                            
                            <div className="flex items-center gap-4">
                                <div className={`${waterDropIcon} text-white p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                    {item.type === 'coding' ? <Code size={16}/> : item.type === 'interview' ? <Video size={16}/> : <Mic size={16}/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-200 text-sm tracking-tight">
                                        {item.topic}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                        {item.type} • {item.date}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border ${
                                    item.score >= 80 ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 
                                    item.score >= 50 ? 'bg-white/10 text-white border-white/20' :
                                    'bg-black/80 text-gray-500 border-white/10'
                                }`}>
                                    {item.score}%
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-600 text-xs font-bold uppercase tracking-widest">No recent activity.</div>
                )}
            </div>
          </motion.div>
        </div>

        {/* --- QUICK ACTIONS --- */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-bold mb-6 text-white tracking-tight px-2">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/setup">
              <ActionCard title="Technical Mock" desc="Practice DSA & System Design" icon={<Code size={20}/>} waterBubbleGlass={waterBubbleGlass} waterDropIcon={waterDropIcon} />
            </Link>
            <Link to="/coding-test">
              <ActionCard title="Coding Challenge" desc="Solve problems with compiler" icon={<Play size={20}/>} waterBubbleGlass={waterBubbleGlass} waterDropIcon={waterDropIcon} />
            </Link>
            <Link to="/hr-interview">
               <ActionCard title="HR Round" desc="Behavioral prep with AI" icon={<Users size={20}/>} waterBubbleGlass={waterBubbleGlass} waterDropIcon={waterDropIcon} />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};


const StatsCard = ({ title, value, icon, trend, trendUp, waterBubbleGlass, waterDropIcon }) => {
    return (
        <div className={`${waterBubbleGlass} p-6 md:p-8 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-500 group`}>
            <div className="flex justify-between items-start mb-8">
                <div className={`${waterDropIcon} w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
                {trend && (
                    <span className={`flex items-center text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm ${trendUp ? 'bg-white/10 text-white border-white/20' : 'bg-black/50 text-gray-500 border-white/10'}`}>
                        {trendUp ? <ArrowUpRight size={12} className="mr-1"/> : <ArrowDownRight size={12} className="mr-1"/>}
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <h4 className="text-5xl font-black text-white tracking-tighter drop-shadow-lg mb-1">{value}</h4>
                <h3 className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em]">{title}</h3>
            </div>
        </div>
    );
};

const ActionCard = ({ title, desc, icon, waterBubbleGlass, waterDropIcon }) => {
    return (
        <div className={`group ${waterBubbleGlass} p-6 rounded-[2.5rem] hover:bg-white/[0.05] transition-all duration-500 cursor-pointer flex items-center justify-between overflow-hidden relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            
            <div className="flex items-center gap-5 relative z-10">
                <div className={`${waterDropIcon} w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-gray-300 group-hover:text-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-200 group-hover:text-white transition-colors tracking-tight mb-1">{title}</h3>
                    <p className="text-[11px] font-medium text-gray-500">{desc}</p>
                </div>
            </div>
            <div className="bg-black/50 p-2.5 rounded-full border border-white/5 shadow-inner group-hover:bg-white group-hover:text-black transition-all relative z-10">
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform"/>
            </div>
        </div>
    );
};

export default Dashboard;