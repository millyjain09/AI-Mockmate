

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