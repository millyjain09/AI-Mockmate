import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import LogoImg from "../assets/logo2.png"; 
import { LogOut, Code, Cpu, Users, MessageCircle, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);

  // --- SMART SCROLL LOGIC ---
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // const getDisplayName = () => {
  //   if (!user) return "Guest";
  //   if (user.username) return user.username;
  //   return user.email.split("@")[0];
  // };

  const getDisplayName = () => {
  if (!user) return "Guest";

  if (user.username) return user.username;

  if (user.email) return user.email.split("@")[0];

  return "User";
};

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={22} /> },
    { name: "Coding", path: "/coding-test", icon: <Code size={22} /> },
    { name: "Tech Mock", path: "/setup", state: { type: "Technical" }, icon: <Cpu size={26} />, isCenter: true },
    { name: "HR Round", path: "/hr-interview", icon: <Users size={22} /> },
    { name: "English", path: "/english-practice", state: { type: "Soft Skills" }, icon: <MessageCircle size={22} /> },
  ];

  const waterDropGlass = "bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[inset_0px_1px_2px_rgba(255,255,255,0.4),inset_0px_-1px_2px_rgba(0,0,0,0.5),0_8px_32px_rgba(0,0,0,0.4)]";

  return (
    <>
      {/* ================= DESKTOP CAPSULE NAVBAR ================= */}
      <div className="fixed top-8 left-0 w-full z-50 hidden md:flex justify-center pointer-events-none">
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={isHidden ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-max max-w-[95vw] pointer-events-auto font-sans"
        >
          <div className={`${waterDropGlass} rounded-full p-2 flex items-center gap-6`}>
            
            {/* Logo Section - Wrapper added for tight grouping */}
            <Link to="/" className="flex items-center gap-2 group px-4 shrink-0">
  <img 
    src={LogoImg} 
    alt="MockMate Logo" 

    className="h-10 w-14 object-cover object-center group-hover:scale-105 transition-transform duration-300" 
  />
  <span className="text-sm font-bold text-white tracking-tighter uppercase italic leading-none">
    MockMate
  </span>
</Link>
   

            {/* Core Links */}
            <div className="flex items-center">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    state={link.state}
                    onMouseEnter={() => setHoveredPath(link.path)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={`relative px-5 py-2 text-[13px] font-semibold transition-colors duration-300 rounded-full z-10 ${
                      isActive ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <AnimatePresence>
                      {hoveredPath === link.path && (
                        <motion.span
                          layoutId="nav-pill"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute inset-0 bg-white/[0.05] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                    {link.name}
                  </Link>
                );
              })}
              
              <Link
                to="/cheatsheets"
                className={`relative px-5 py-2 text-[13px] font-semibold transition-colors duration-300 rounded-full z-10 ${
                  location.pathname === "/cheatsheets" ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Cheat Sheets
              </Link>
            </div>

            {/* Auth / Profile */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
              {user ? (
                <div className="flex items-center gap-2">
                   <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2">
                     {getDisplayName()}
                   </span>
                   <button 
                    onClick={handleLogout} 
                    className="p-2.5 rounded-full bg-white/[0.02] hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className={`${waterDropGlass} hover:bg-white/[0.08] text-white px-7 py-2.5 rounded-full text-[12px] font-black transition-all active:scale-95 uppercase tracking-wide`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* ================= MOBILE TOP BAR ================= */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: isHidden ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden fixed top-0 w-full z-40 bg-black/50 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex justify-between items-center"
      >
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            {/* Same object-cover logic for mobile to handle the wide image */}
            <img 
              src={LogoImg} 
              alt="Logo" 
              className="h-10 w-12 object-cover object-center" 
            />
            {/* Maine 'hidden sm:block' hata diya hai, ab ye hamesha show hoga */}
            <span className="text-sm font-bold text-white tracking-tighter uppercase italic leading-none">
              MockMate
            </span>
          </Link>
        </div>
        
        {user ? (
            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
        ) : (
          <Link to="/login" className={`${waterDropGlass} text-xs font-black text-white px-5 py-2 rounded-full uppercase active:scale-95`}>
            Login
          </Link>
        )}
      </motion.div>

      {/* ================= MOBILE BOTTOM DOCK ================= */}
      <div className="md:hidden fixed bottom-6 left-0 w-full z-50 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: 0, opacity: 1 }}
          animate={isHidden ? { y: 150, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-[90vw] max-w-[400px] pointer-events-auto relative"
        >
          <div className={`${waterDropGlass} rounded-[2.5rem] px-4 py-3 flex justify-between items-center relative`}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.isCenter) return <div key="spacer" className="w-14 h-10 flex-shrink-0" />;

              return (
                <Link key={link.path} to={link.path} state={link.state} className="relative p-2 flex flex-col items-center gap-1">
                  {isActive && (
                    <motion.div layoutId="mobile-active-dot" className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" />
                  )}
                  <div className={`transition-all duration-300 ${isActive ? "text-white -translate-y-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-gray-500"}`}>
                    {link.icon}
                  </div>
                </Link>
              );
            })}
          </div>

          {navLinks.map((link) => {
            if (!link.isCenter) return null;
            const isActive = location.pathname === link.path;
            return (
              <div key="center-button" className="absolute left-1/2 -translate-x-1/2 -top-6 z-[100]">
                <Link to={link.path} state={link.state} className="block">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90 border-[5px] border-[#020202] ${
                      isActive ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)]" : `${waterDropGlass} text-white`
                    }`}>
                      {link.icon}
                    </div>
                </Link>
              </div>
            );
          })}
        </motion.div>
      </div>
      
      <div className="md:hidden h-28 w-full"></div>
    </>
  );
};

export default Navbar;