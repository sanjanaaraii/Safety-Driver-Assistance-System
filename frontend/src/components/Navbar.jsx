import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">SDAC</div>

      <div className="nav-links">
        <span className="active">Book a driver</span>
        <span>Safety</span>
      </div>

      <div className="nav-right">
        <button className="activity-btn">Activity</button>
        <div className="profile">👤</div>
      </div>
    </nav>
  );
}
