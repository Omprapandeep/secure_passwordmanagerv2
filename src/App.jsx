import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./pages/login.jsx";
import Signup from "./pages/Signup";
import { isLoggedIn } from "./utils/auth";

function App() {
  const [theme, settheme] = useState(true);
  const [isAuth, setIsAuth] = useState(isLoggedIn());

  return (
    <BrowserRouter>
    <div className="min-h-screen flex flex-col">

  
      {isAuth && (
        <Navbar theme={theme} settheme={settheme} setIsAuth={setIsAuth} />
      )}
      
      <div className="flex-1 overflow-hidden">
        <Routes>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            isAuth ? <Manager theme={theme} /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </div>
      

      {isAuth && <Footer />} 
     </div>
    </BrowserRouter>
  );
}

export default App;
