import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// 👇 Import Home Page
import Home from "./pages/Home"; 

// 👇 Import the NEW AuthPage (Replaces separate Login & Signup)
import AuthPage from "./pages/AuthPage"; 

import Dashboard from "./pages/Dashboard";
import SetupInterview from "./pages/SetupInterview";
import InterviewRoom from "./pages/InterviewRoom"; 
import ResultPage from "./pages/ResultPage";
import CodingTest from "./pages/CodingTest";
import EnglishPractice from './pages/EnglishPractice';
import HRInterview from "./pages/HRInterview";

// 🔴 ADDED THIS IMPORT FOR CHEAT SHEETS
import CheatSheets from "./components/CheatSheets"; 

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
      <Router>
        <Routes>
          {/* 👇 Set Home as the default Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* 👇 Dono routes ab apne merged AuthPage par point karenge */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup" element={<SetupInterview />} />
          <Route path="/interview-room" element={<InterviewRoom />} /> 
          <Route path="/result" element={<ResultPage />} />
          <Route path="/coding-test" element={<CodingTest />} />
          <Route path="/english-practice" element={<EnglishPractice />} />
          <Route path="/hr-interview" element={<HRInterview />} />
          
          {/* 🔴 ADDED THIS ROUTE FOR CHEAT SHEETS */}
          <Route path="/cheatsheets" element={<CheatSheets />} />

        </Routes>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;