"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
  };

  const menuItems = [
    { path: "/profile", icon: "icon-grid", title: "Dashboard" },
    { path: "/profile/mytribes", icon: "mdi mdi-account-multiple", title: "Tribes" },
    { path: "/profile/lift-ai", icon: "fa-solid fa-brain", title: "Lift AI" },
    { path: "/profile/tools", icon: "mdi mdi-wrench", title: "Growth Toolkit" },
    { path: "/profile/courses", icon: "fa fa-graduation-cap", title: "Courses" },
    { path: "/profile/chat", icon: "ti-comment", title: "Chat" },
    { path: "/profile/mytribers", icon: "ti-link", title: "My Tribers" },
    { path: "/profile/myprofile", icon: "ti-user", title: "My Profile" },
    { path: "/profile/settings", icon: "mdi mdi-account-check", title: "Account Management" },
    { path: "/profile/support", icon: "mdi mdi-help-circle-outline", title: "Support" }, // Added Support tab
  ];

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`nav-item ${pathname === item.path ? "active" : ""}`}
          >
            {item.path === "/profile/settings" ? (
              // For settings, force a full page refresh:
              <a
                href={item.path}
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = item.path;
                }}
              >
                <i className={`${item.icon} menu-icon`} />
                <span className="menu-title">{item.title}</span>
              </a>
            ) : (
              // For all other items, use Next.js Link for client-side navigation.
              <Link className="nav-link" href={item.path}>
                <i className={`${item.icon} menu-icon`} />
                <span className="menu-title">{item.title}</span>
              </Link>
            )}
          </li>
        ))}
        <li className="nav-item">
          <Link href="#" className="nav-link" onClick={handleLogout}>
            <i className="ti-power-off menu-icon" />
            <span className="menu-title">Sign Out</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
