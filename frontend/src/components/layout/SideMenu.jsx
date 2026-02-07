import React from "react";
import { useSelector } from "react-redux";
import { FaHome, FaSearch, FaHeart, FaUserCircle } from "react-icons/fa";
import { MdMusicNote } from "react-icons/md";
import "../../css/sidemenu/SideMenu.css";

const SideMenu = ({ view, setView, onEditProfile }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="sidemenu-root">
      {/* Logo/Brand Section */}
      <div className="sidemenu-brand">
        <div className="brand-icon">
          <MdMusicNote size={32} />
        </div>
        <h2 className="brand-name">Synthesia</h2>
      </div>

      {/* Navigation Buttons */}
      <nav className="sidemenu-nav">
        <button
          className={view === "home" ? "menu-btn active" : "menu-btn"}
          onClick={() => setView("home")}
        >
          <FaHome className="menu-icon" size={20} />
          <span>Home</span>
        </button>

        <button
          className={view === "search" ? "menu-btn active" : "menu-btn"}
          onClick={() => setView("search")}
        >
          <FaSearch className="menu-icon" size={20} />
          <span>Search</span>
        </button>

        <button
          className={view === "favourite" ? "menu-btn active" : "menu-btn"}
          onClick={() => setView("favourite")}
        >
          <FaHeart className="menu-icon" size={20} />
          <span>Favourite</span>
        </button>
      </nav>

      {/* User Profile Section at Bottom */}
      <div className="sidemenu-footer">
        <button className="profile-btn" onClick={onEditProfile}>
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name || "User"} />
            ) : (
              <FaUserCircle size={40} />
            )}
          </div>
          <div className="profile-info">
            <span className="profile-name">
              {user?.name || "Internship Team"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
