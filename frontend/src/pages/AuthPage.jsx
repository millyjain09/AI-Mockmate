import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, ChevronLeft, Laptop2 } from "lucide-react";
import axios from "axios";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AuthPage = () => {

  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(""); 
    setLoading(true);
    try {
      if (loginEmail && loginPassword) { 
        login({ email: loginEmail, name: "User" }); 
        navigate("/dashboard"); 
      }
    } catch (err) { 
      setError("Login Failed."); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); 
    setError(""); 
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, signupData);
      if (res.data?.user) { 
        login(res.data.user); 
        navigate("/"); 
      }
    } catch (err) { 
      setError(err.response?.data?.detail || "Signup Failed."); 
    } finally { 
      setLoading(false); 
    }
  };

  // GOOGLE AUTH
  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      login({
        email: user.email,
        name: user.displayName
      });

      navigate("/dashboard");

    } catch (err) {
      setError("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const waterDropCard = "bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.3),inset_0px_-1px_2px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.6)]";
  
  const waterDropButton = "w-full bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.6),inset_0px_-1px_2px_rgba(0,0,0,0.5)] text-white font-bold py-3.5 rounded-xl hover:bg-white/[0.12] transition-all active:scale-95 flex items-center justify-center gap-2 mt-2";
  
  const inputClasses = "w-full bg-black/40 backdrop-blur-md border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-black/60 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.4)] transition-all font-medium";

  const secondaryButtonClasses = "w-full bg-white/[0.02] border border-white/10 text-gray-400 font-medium rounded-xl py-3.5 text-sm hover:text-white hover:bg-white/[0.05] transition-colors active:scale-95 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.1)]";

  const fadeVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -15, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans bg-black">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#050505] to-black"></div>
         <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-white/[0.04] blur-[140px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gray-400/[0.05] blur-[120px]"></div>
         <div className="absolute inset-0 bg-[url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')] opacity-[0.04] mix-blend-overlay"></div>
      </div>

      <div className="absolute top-8 left-8 z-20">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors py-2 rounded-lg bg-white/[0.02] px-4 border border-white/5 backdrop-blur-md shadow-[inset_0px_1px_1px_rgba(255,255,255,0.1)]">
            <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div className={`relative z-10 w-full max-w-[420px] p-8 md:p-10 rounded-[2.5rem] ${waterDropCard}`}>
        
        <div className="mb-8 flex flex-col items-center">
           <div className="p-3.5 bg-white/[0.05] rounded-2xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.3),inset_0px_-1px_2px_rgba(0,0,0,0.5)] mb-4 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <Laptop2 size={28} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] relative z-10" strokeWidth={1.5} />
           </div>
           <h2 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-sm">
             AI MockMate
           </h2>
        </div>

        <AnimatePresence mode="wait">
          
          {isLogin ? (
            <motion.div key="login" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2 tracking-tight text-white">Welcome back</h1>
                <p className="text-gray-400 text-xs font-medium">
                  First time here? <button onClick={() => {setIsLogin(false); setError("")}} className="text-white hover:text-gray-300 transition-colors font-bold ml-1">Sign up for free</button>
                </p>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-5 text-sm text-red-400 text-center shadow-inner">{error}</div>}

              <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" placeholder="Your email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className={inputClasses} />
                <input type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className={inputClasses} />
                
                <button type="submit" disabled={loading} className={waterDropButton}>
                  {loading ? <Loader className="animate-spin" size={18} /> : "Sign in"}
                </button>

                <button type="button" onClick={handleGoogleAuth} disabled={loading} className={secondaryButtonClasses}>
                  Sign in with Google
                </button>
              </form>

            </motion.div>
          ) : (
            <motion.div key="signup" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
               <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2 tracking-tight text-white">Create account</h1>
                <p className="text-gray-400 text-xs font-medium">
                  Already have one? <button onClick={() => {setIsLogin(true); setError("")}} className="text-white hover:text-gray-300 transition-colors font-bold ml-1">Sign in</button>
                </p>
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl mb-5 text-sm text-red-400 text-center shadow-inner">{error}</div>}

              <form onSubmit={handleSignup} className="space-y-4">
                <input type="text" placeholder="Full Name" value={signupData.username} onChange={(e) => setSignupData({...signupData, username: e.target.value})} required className={inputClasses} />
                <input type="email" placeholder="email@domain.com" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} required className={inputClasses} />
                <input type="password" placeholder="Set password" value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} required className={inputClasses} />
                
                <button type="submit" disabled={loading} className={waterDropButton}>
                  {loading ? <Loader className="animate-spin" size={18} /> : "Create account"}
                </button>

                <button type="button" onClick={handleGoogleAuth} disabled={loading} className={secondaryButtonClasses}>
                  Sign up with Google
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;