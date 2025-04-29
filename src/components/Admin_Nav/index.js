"use client";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import MainResources from "../AdminExternalResources";
const Navbar = () => {
  const { user } = useAuth(); // Get user details from AuthContext
  const { logout } = useAuth();
  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default link navigation
    alert("logout");
    logout();
  };
  return (
    <>
    <nav className="navbar navbar-expand-lg main-navbar sticky">
  <div className="form-inline mr-auto">
    <ul className="navbar-nav mr-3">
      <li>
        <a
          href="#"
          data-toggle="sidebar"
          className="nav-link nav-link-lg
									collapse-btn"
        >
          {" "}
          <i data-feather="align-justify" />
        </a>
      </li>
      <li>
        <a href="#" className="nav-link nav-link-lg fullscreen-btn">
          <i data-feather="maximize" />
        </a>
      </li>
    </ul>
  </div>
  <ul className="navbar-nav navbar-right">
  </ul>
</nav>


    </>
  );
};

export default Navbar;