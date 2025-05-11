// components/Admin_Sidebar.jsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { fetchMe } from "@/app/api";

const Sidebar = () => {
  const { logout } = useAuth();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Fetch & set the correct object
  useEffect(() => {
    async function loadProfile() {
      try {
        const userData = await fetchMe();
        setMe(userData);                        // ← store that full object
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // 2) Log state whenever it actually updates
  useEffect(() => {
  }, [me]);
  

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
  };

  // while loading, you could show a spinner or just hide Admin link
  return (
    <div className="main-sidebar sidebar-style-2">
      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
          <a href="/admin/opulententrepreneurs/open/dashboard">
            <img
              alt="image"
              src="/assets/admin_assets/img/logo.png"
              className="header-logo"
            />
          </a>
        </div>

        <ul className="sidebar-menu">
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
          {/* Courses */}
          <li className="dropdown">
            <a
              href="#"
              className="menu-toggle nav-link has-dropdown"
            >
              <i data-feather="flag" />
              <span className="ml-1">Courses</span>
              <i
                data-feather="chevron-down"
                className="dropdown-arrow ml-1"
              />
            </a>
            <ul className="dropdown-menu">
              <li>
                <a
                  className="nav-link"
                  href="/admin/opulententrepreneurs/open/courses"
                >
                  View Courses
                </a>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="/admin/opulententrepreneurs/open/courses/create"
                >
                  Create New
                </a>
              </li>
            </ul>
          </li>
          {/* Tools */}
          <li className="dropdown">
            <a
              href="#"
              className="menu-toggle nav-link has-dropdown"
            >
              <i data-feather="pie-chart" />
              <span className="ml-1">Tools</span>
              <i
                data-feather="chevron-down"
                className="dropdown-arrow ml-1"
              />
            </a>
            <ul className="dropdown-menu">
              <li>
                <a
                  className="nav-link"
                  href="/admin/opulententrepreneurs/open/tools"
                >
                  View Tools
                </a>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="/admin/opulententrepreneurs/open/tools/create"
                >
                  Create Tool
                </a>
              </li>
            </ul>
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

          <li className="menu-header">Manage Users</li>
          <li className="dropdown">
            <a
              href="/admin/opulententrepreneurs/open/accounts"
              className="nav-link"
            >
              <i data-feather="user-check" />
              <span>Accounts</span>
            </a>
          </li>

          {/* Admin tab only for level === 'admin' */}
          {!loading && me?.level === "admin" && (
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

          <li className="dropdown">
            <a
              href="#"
              className="nav-link"
            >
              <i data-feather="bell" />
              <span>Send Notifications</span>
            </a>
          </li>
          <li className="dropdown">
            <a
              href="/admin/opulententrepreneurs/open/support"
              className="nav-link"
            >
              <i data-feather="flag" />
              <span>Support</span>
            </a>
          </li>
          <li className="dropdown">
            <a
              href="/admin/opulententrepreneurs/open/payment"
              className="nav-link"
            >
              <i data-feather="credit-card" />
              <span>Payment</span>
            </a>
          </li>

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

          <li className="menu-header">Logout</li>
          <li className="dropdown">
            <Link href="#" className="nav-link" onClick={handleLogout}>
              <i data-feather="power" />
              <span>Sign Out</span>
            </Link>
          </li>
          <li className="menu-header">----</li>
          <li className="menu-header">----</li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
