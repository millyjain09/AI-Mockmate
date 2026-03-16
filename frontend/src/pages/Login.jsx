// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { motion } from "framer-motion";
// import { Lock, Mail, ArrowRight } from "lucide-react";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     // Dummy Logic for now (Backend connect baad mein)
//     if (email && password) {
//       login({ email, name: "User" }); // Set User
//       navigate("/dashboard"); // Send to Dashboard
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
//       {/* Background Blobs for Premium Feel */}
//       <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]" />

//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
//       >
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
//           <p className="text-slate-400">Login to access your AI Interview Dashboard</p>
//         </div>

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
//             <div className="relative">
//               <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
//               <input 
//                 type="email" 
//                 placeholder="you@example.com"
//                 className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
//             <div className="relative">
//               <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
//               <input 
//                 type="password" 
//                 placeholder="••••••••"
//                 className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <button 
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
//           >
//             Sign In <ArrowRight size={20} />
//           </button>
//         </form>

//         <p className="text-center text-slate-400 mt-6">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">
//             Sign Up
//           </Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      login({
        email: user.email,
        name: user.displayName
      });

      navigate("/dashboard");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
      >

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>

          <p className="text-slate-400">
            Login to access your AI Interview Dashboard
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all"
        >

          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            width="20"
          />

          Sign in with Google

        </button>

      </motion.div>

    </div>
  );
};

export default Login;