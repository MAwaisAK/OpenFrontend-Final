"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import MainResources from "../AdminExternalResources";
import {
  getUserNotifications,
  removeNotificationItem,
  removeAllNotifications
} from "../../app/api"; // Adjust paths as needed

const Nav = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]); // Array of { type, data }
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Pass user._id as a parameter to getUserNotifications
      const response = await getUserNotifications(user?._id);
      // Expecting response.data to be an object like { type: [...], data: [...] }
      if (response && response.data) {
        const types = response.data.type || [];
        const datas = response.data.data || [];
        const notifs = types.map((t, i) => ({ type: t, data: datas[i] }));
        setNotifications(notifs);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
  };

  // Refresh notifications when clicking the refresh icon
  const handleRefresh = (e) => {
    e.preventDefault();
    fetchNotifications();
  };

  // Remove a specific notification item and pass user id
  const handleRemoveNotification = async (notif, e) => {
    // Prevent triggering parent click event
    e.stopPropagation();
    try {
      await removeNotificationItem({ type: notif.type, data: notif.data }, user?._id);
      // Refresh the list after removal
      fetchNotifications();
    } catch (error) {
      console.error("Failed to remove notification:", error);
    }
  };

  // Clear all notifications, passing user id
  const handleClearAll = async (e) => {
    e.preventDefault();
    try {
      await removeAllNotifications(user?._id);
      fetchNotifications();
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  // When clicking on a notification item, if type is "message", navigate to chat page.
  const handleNotificationClick = (notif) => {
    if (notif.type === "message") {
      router.push("/profile/chat");
    }
  };

  return (
    <>
      <MainResources />
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
          <a className="navbar-brand brand-logo me-5" href="/profile">
            <img src="/assets/img/logo.png" className="me-2" alt="logo" />
          </a>
          <a className="navbar-brand brand-logo-mini" href="/">
            <img src="/assets/img/O.png" alt="logo" />
          </a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <button
            className="navbar-toggler navbar-toggler align-self-center"
            type="button"
            data-toggle="minimize"
          >
            <span className="icon-menu" />
          </button>
          <ul className="navbar-nav mr-lg-2">
            {/* Additional nav items */}
          </ul>
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item dropdown">
              <a
                className="nav-link count-indicator dropdown-toggle"
                id="notificationDropdown"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i className="icon-bell mx-0" />
                {notifications.length > 0 && (
                  <span className="count" style={{ fontSize: "6px", color: "white" }}>
                    {notifications.length}
                  </span>
                )}

              </a>
              <div
                className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"
                aria-labelledby="notificationDropdown"
              >
                <div className="d-flex align-items-center justify-content-between px-3">
                  <p className="mb-0 font-weight-normal dropdown-header">
                    Notifications
                  </p>
                  <a href="#" onClick={handleRefresh} title="Refresh Notifications">
                    <i className="ti-reload" style={{ fontSize: "18px" }} />
                  </a>
                </div>
                {loading && (
                  <div className="text-center py-2">
                    <small>Loading...</small>
                  </div>
                )}
                {!loading && notifications.length === 0 && (
                  <div className="text-center py-2">
                    <small>No notifications</small>
                  </div>
                )}
                {/* Notifications container with fixed max-height and scroll */}
                {!loading && notifications.length > 0 && (
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {notifications.map((notif, index) => {
                    // Dynamic values
                    let title = "Notification";
                    let iconClass = "ti-bell mx-0";
                    let iconBg = "bg-info";
                    let redirectPath = null;

                    switch (notif.type) {
                      case "announcement":
                        title = "Announcement";
                        iconClass = "ti-info-alt mx-0";
                        iconBg = "bg-success";
                        break;
                      case "message":
                        title = "Message";
                        iconClass = "ti-email mx-0";
                        iconBg = "bg-warning";
                        break;
                      case "friendrequest":
                        title = "Request";
                        iconClass = "ti-user mx-0"; // user icon
                        iconBg = "bg-primary";
                        redirectPath = "/profile/mytribers";
                        break;
                      case "acceptrequest":
                        title = "Accepted";
                        iconClass = "ti-check mx-0"; // checkmark
                        iconBg = "bg-success";
                        redirectPath = "/profile/mytribers";
                        break;
                      case "coursecreate":
                        title = "New Course";
                        iconClass = "ti-book mx-0"; // book icon
                        iconBg = "bg-info";
                        redirectPath = "/profile/courses";
                        break;
                      case "coursedelete":
                        title = "Course Deleted";
                        iconClass = "ti-trash mx-0"; // trash icon
                        iconBg = "bg-danger";
                        break;
                      case "toolcreate":
                        title = "New Tool Added";
                        iconClass = "ti-wand mx-0"; // wand/magic icon
                        iconBg = "bg-secondary";
                        redirectPath = "/profile/tools";
                        break;
                      case "7days":
                        title = "Subscription Alert";
                        iconClass = "ti-info-alt mx-0"; // info icon
                        iconBg = "bg-info";
                        break;
                      case "over":
                        title = "Subscription Ended";
                        iconClass = "ti-alert mx-0"; // alert icon
                        iconBg = "bg-danger";
                        break;
                      case "incomplete":
                          title = "Incomplete Profile";
                          iconClass = "ti-info-alt mx-0";   // the “i” icon
                          iconBg    = "bg-warning";         // yellow background
                          redirectPath = "/profile/settings";
                          break;
                        

                    }

                    const handleClick = () => {
                      if (redirectPath) {
                        window.location.href = redirectPath;
                      } else {
                        handleNotificationClick(notif);
                      }
                    };

                    return (
                      <div
                        key={index}
                        className="dropdown-item preview-item d-flex align-items-center"
                        onClick={handleClick}
                        style={{
                          cursor: "pointer",
                          position: "relative"
                        }}
                      >
                        <div className="preview-thumbnail">
                          <div className={`preview-icon ${iconBg}`}>
                            <i className={iconClass} />
                          </div>
                        </div>
                        <div className="preview-item-content">
                          <h6 className="preview-subject font-weight-normal">{title}</h6>
                          <p className="font-weight-light small-text mb-0 text-muted">
                            {notif.data}
                          </p>
                        </div>
                        {/* X icon to remove notification */}
                        <button
                          onClick={(e) => handleRemoveNotification(notif, e)}
                          style={{
                            position: "absolute",
                            right: "5px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            color: "#dc3545",
                            fontSize: "16px",
                            cursor: "pointer"
                          }}
                          title="Remove Notification"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
                )}

                {!loading && notifications.length > 0 && (
                  <div className="text-end px-3">
                    <a href="#" onClick={handleClearAll}>
                      Clear all
                    </a>
                  </div>
                )}

              </div>
            </li>
            <li className="nav-item nav-profile dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                id="profileDropdown"
              >
                <img
                  src={
                    user?.profile_pic ||
                    "/assets/admin_assets/img/users/user.png"
                  }
                  alt="profile"
                  className="rounded-circle"
                  width="40"
                  height="40"
                />
              </a>
              <div
                className="dropdown-menu dropdown-menu-right navbar-dropdown"
                aria-labelledby="profileDropdown"
              >
                <a className="dropdown-item" href="/profile/settings">
                  <i className="ti-settings text-primary" /> Settings
                </a>
                <Link href="#" className="dropdown-item" onClick={handleLogout}>
                  <i className="ti-power-off text-primary" />
                  <span className="menu-title">Sign Out</span>
                </Link>
              </div>
            </li>
          </ul>

          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            data-toggle="offcanvas"
          >
            <span className="icon-menu" />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Nav;
