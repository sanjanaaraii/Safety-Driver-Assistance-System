import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import "../styles/navbar.css";

export default function Navbar() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="logo" onClick={() => navigate("/")}>
          SDAC
        </span>

        <nav className="primary-nav">
          <span className="nav-item" onClick={() => navigate("/safety")}>
            Safety
          </span>

          <div className="nav-item dropdown">
              <span onClick={() => setAboutOpen(prev => !prev)}>
                About ▾
              </span>

              {aboutOpen && (
                <div className="dropdown-menu">
                  <span onClick={() => navigate("/how-it-works")}>
                    How it works
                  </span>

                  <span onClick={() => navigate("/mission")}>
                    Our mission
                  </span>

                  <span onClick={() => navigate("/contact")}>
                    Contact
                  </span>
                </div>
              )}
            </div>
            </nav>
            </div>

      <div className="navbar-right">
        <span className="nav-item" onClick={() => navigate("/help")}>
          Help
        </span>

        <span className="nav-item">Activity</span>

        <div className="profile-wrapper">
          <div
            className="profile-pill"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            Profile ▾
          </div>

          {profileOpen && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}
