// components/Admin_Sidebar.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { fetchMe } from "@/app/api";
import feather from "feather-icons";

const Sidebar = () => {
  const { logout } = useAuth();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMenus, setOpenMenus] = useState({});
  const menuRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    async function loadProfile() {
      try {
        const userData = await fetchMe();
        setMe(userData);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Replace feather icons and scroll to bottom once menu is rendered
  useEffect(() => {
    if (!loading) {
      // swap <i data-feather="..."> to SVG
      feather.replace();

      // scroll sidebar to bottom
      if (menuRef.current) {
        menuRef.current.scrollTop = menuRef.current.scrollHeight;
      }
    }
  }, [loading, me]);

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
  };

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="main-sidebar sidebar-style-2">
      <aside
        id="sidebar-wrapper"
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <div className="sidebar-brand">
          <a href="/admin/opulententrepreneurs/open/dashboard">
            <img
              alt="image"
              src="/assets/admin_assets/img/logo.png"
              className="header-logo"
            />
          </a>
        </div>

        <ul ref={menuRef} className="sidebar-menu">
          <li className="menu-header">Main</li>
          <li className="dropdown active">
            <a
              href="/admin/opulententrepreneurs/open/dashboard"
              className="nav-link"
            >
              <i data-feather="monitor" />
              <span>Dashboard</span>
            </a>
          </li>

          {!loading && (me?.level === "super" || me?.level === "community") && (
            <>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/tribes"
                  className="nav-link"
                >
                  <i data-feather="briefcase" />
                  <span>Tribes</span>
                </a>
              </li>

              <li className="menu-header">Tools & Courses</li>

              <li className={`dropdown ${openMenus.courses ? 'active' : ''}`}>
                <a
                  href="#"
                  className="menu-toggle nav-link has-dropdown"
                  onClick={() => toggleMenu('courses')}
                >
                  <i data-feather="flag" />
                  <span className="ml-1">Courses</span>
                  <i
                    data-feather={openMenus.courses ? 'chevron-up' : 'chevron-down'}
                    className="dropdown-arrow ml-1"
                  />
                </a>
                {openMenus.courses && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link href="/admin/opulententrepreneurs/open/courses" className="nav-link">
                        View Courses
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/opulententrepreneurs/open/courses/create" className="nav-link">
                        Create New
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li className={`dropdown ${openMenus.tools ? 'active' : ''}`}>
                <a
                  href="#"
                  className="menu-toggle nav-link has-dropdown"
                  onClick={() => toggleMenu('tools')}
                >
                  <i data-feather="pie-chart" />
                  <span className="ml-1">Tools</span>
                  <i
                    data-feather={openMenus.tools ? 'chevron-up' : 'chevron-down'}
                    className="dropdown-arrow ml-1"
                  />
                </a>
                {openMenus.tools && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link href="/admin/opulententrepreneurs/open/tools" className="nav-link">
                        View Tools
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/opulententrepreneurs/open/tools/create" className="nav-link">
                        Create Tool
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/categories"
                  className="nav-link"
                >
                  <i data-feather="edit" />
                  <span>Adjust Categories</span>
                </a>
              </li>
            </>
          )}
          {!loading &&
            (me?.level === "super" ||
              me?.level === "community" ||
              me?.level === "finance") && (
              <>
                <li className="menu-header">Manage Users</li>
              </>
            )}
          {!loading && (me?.level === "super" || me?.level === "community" || me?.level === "finance") && (
            <>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/accounts"
                  className="nav-link"
                >
                  <i data-feather="user-check" />
                  <span>Accounts</span>
                </a>
              </li>
            </>
          )}

          {!loading && me?.level === "super" && (
            <li className="dropdown">
              <a
                href="/admin/opulententrepreneurs/open/admins"
                className="nav-link"
              >
                <i className="mdi mdi-account-check" aria-hidden="true" />
                <span>Admin</span>
              </a>
            </li>
          )}
          {!loading && (me?.level === "super" || me?.level === "community") && (
            <>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/notifications"
                  className="nav-link"
                >
                  <i data-feather="bell" />
                  <span>Send Notifications</span>
                </a>
              </li>
            </>
          )}
          {!loading &&
            (me?.level === "super" ||
              me?.level === "finance" ||
              me?.level === "community") && (
              <>
                <li className="dropdown">
                  <a
                    href="/admin/opulententrepreneurs/open/support"
                    className="nav-link"
                  >
                    <i data-feather="flag" />
                    <span>Support</span>
                  </a>
                </li>
              </>
            )}
          {!loading && (me?.level === "super" || me?.level === "finance") && (
            <>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/payment"
                  className="nav-link"
                >
                  <i data-feather="credit-card" />
                  <span>Payment</span>
                </a>
              </li>
            </>
          )}
          {!loading && (me?.level === "super" || me?.level === "finance") && (
            <>
              <li className="menu-header">Subscription</li>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/pricing"
                  className="nav-link"
                >
                  <i data-feather="dollar-sign" />
                  <span>Price</span>
                </a>
              </li>
            </>
          )}
          {!loading && (me?.level === "super" || me?.level === "ai") && (
            <>
              <li className="menu-header">Manage AI</li>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/manageai"
                  className="nav-link"
                >
                  <i data-feather="cpu" />
                  <span>Manage AI</span>
                </a>
                <a
                  href="/admin/opulententrepreneurs/open/usertokens"
                  className="nav-link"
                >
                  <i data-feather="cpu" />
                  <span>Tokens</span>
                </a>
              </li>
            </>
          )}
          {!loading && (me?.level === "super" || me?.level === "community") && (
            <>
              <li className="menu-header">Manage UI</li>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/images"
                  className="nav-link"
                >
                  <i data-feather="layout" />
                  <span>Change Images</span>
                </a>
              </li>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/testimonals"
                  className="nav-link"
                >
                  <i data-feather="grid" />
                  <span>Testimonials</span>
                </a>
              </li>
              <li className="dropdown">
                <a
                  href="/admin/opulententrepreneurs/open/news"
                  className="nav-link"
                >
                  <i data-feather="file-text" />
                  <span>News</span>
                </a>
              </li>
            </>
          )}

          <li className="menu-header">Logout</li>
          <li className="dropdown">
            <Link href="#" className="nav-link" onClick={handleLogout}>
              <i data-feather="power" />
              <span>Sign Out</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
