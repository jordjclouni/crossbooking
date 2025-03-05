import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Place from "./pages/Place";
import Home from "./pages/Home";
import SearchBooks from "./pages/SearchBooks";
import About from "./pages/About";
import LabWorkPage from "./pages/LabWorkPage";
import Profile from "./pages/UserProfile";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import { AuthProvider } from "./context/AuthContext"; // Импортируйте AuthProvider
import AddBook from "./pages/AddBook";
import AdminPanel from "./pages/AdminPanel";
import AdminSafeShelves from "./pages/AdminSafeShelves";
import AdminGenres from "./pages/AdminGenres";
import AdminAuthors from "./pages/AdminAuthors";
import Test from "./pages/Test";
import Inventory from "./pages/Inventory";
import BookExchange from "./pages/BookExchange";

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
          <Route path="/LabWorkPage" element={<LabWorkPage />} />
          <Route path="/addbook" element={<AddBook />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/safe-shelves" element={<AdminSafeShelves />} />
          <Route path="/admin/genres" element={<AdminGenres />} />
          <Route path="/admin/authors" element={<AdminAuthors />} />
          <Route path="/test" element={<Test />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/exchange" element={<BookExchange />} />

          {/* Модальные окна */}
          <Route path="/login" element={<LoginModal />} />                 
          <Route path="/register" element={<RegisterModal />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
