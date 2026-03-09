import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Help from "./pages/Help";
import Register from "./pages/Register";
import Safety from "./pages/Safety";
import HowItWorks from "./pages/howitworks";
import Contact from "./pages/contact";
import Mission from "./pages/mission";

function Layout() {
  const isLoggedIn = localStorage.getItem("token");
  const location = useLocation();

  return (
    <>
      {isLoggedIn && location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/safety"
          element={isLoggedIn ? <Safety /> : <Navigate to="/login" />}
        />
        <Route
          path="/help"
          element={isLoggedIn ? <Help /> : <Navigate to="/login" />}
        />
      </Routes>

      <Routes>
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/mission" element={<Mission />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}