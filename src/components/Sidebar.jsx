import React from "react";

const menuItems = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "analytics", icon: "◔", label: "Analytics" },
  { id: "history", icon: "☰", label: "History" },
  { id: "goals", icon: "◎", label: "Goals" },
];

export default function Sidebar({ activePage, onChangePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-dot"></div>
        <div>
          <p className="logo-title">Digital Wellness</p>
          <p className="logo-subtitle">Recommendation Engine</p>
        </div>
      </div>
      <nav className="menu" aria-label="Main navigation">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activePage === item.id ? "active" : ""}`}
            type="button"
            onClick={() => onChangePage(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
