import { useState } from "react";

export default function Navbar() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="navbar">
    
      <div className="navbar-left">
        <span className="logo">SDAC</span>

        <nav className="primary-nav">
          <span className="nav-item">Safety</span>

          <div
            className="nav-item dropdown"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            About ▾
            {aboutOpen && (
              <div className="dropdown-menu">
                <span>How it works</span>
                <span>Our mission</span>
                <span>Contact</span>
              </div>
            )}
          </div>
        </nav>
      </div>

      
      <div className="navbar-right">
        <span className="nav-item">Help</span>
        <span className="nav-item">Activity</span>

        <div className="profile-pill">
          Profile ▾
        </div>
      </div>
    </header>
  );
}
