import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Place from "./pages/Place";
import Home from "./pages/Home";
import SearchBooks from "./pages/SearchBooks";
import About from "./pages/About";
import Profile from "./pages/UserProfile";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import { AuthProvider } from "./context/AuthContext"; // Импортируйте AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/place" element={<Place />} />
          <Route path="/search" element={<SearchBooks />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/profile"
            element={
              <Profile />
            }
          />
          {/* Модальные окна */}
          <Route path="/login" element={<LoginModal />} />
          <Route path="/register" element={<RegisterModal />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
