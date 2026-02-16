import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import "../styles/profileDropdown.css";

export default function ProfileDropdown() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="profile-dropdown">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-name">Sanjana Rai</div>
        </div>
        <div className="profile-avatar">👤</div>
      </div>

      <div className="profile-actions">
        <div className="action-card">Activity</div>
        <div className="action-card">Help</div>
        <div className="action-card">Safety</div>
      </div>

      <div className="profile-list">
        <div className="list-item">Manage account</div>
        <div className="list-item">Trip history</div>
      </div>

      <button className="signout-btn" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}
