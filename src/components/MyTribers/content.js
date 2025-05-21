"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/tribe-profile.css";
import {
  getRandomUserProfiles,
  removeFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  blockUser,
  createChatLobbyRequest,
  unblockUser,
  getFriendRequests,
  createSupportReport,
  fetchMe,
  getFriendList,
  getAllBlockedForUserAPI,
} from "@/app/api";

// Helper function to get user ID (either _id or id)
const getUserId = (user) => user?._id || user?.id;

const UserList = () => {
  // State for profiles, friend requests, blocked users, and UI controls.
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("tribers"); // "tribers", "requests", or "blocked"
  const [reportReason, setReportReason] = useState("spam");
  const [reportDescription, setReportDescription] = useState("");

  // State for infinite scroll
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const usersPerPage = 10;

  // Fetch the authenticated user once on mount.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchMe();
        setAuthUser(userData);
      } catch (error) {
        console.error("Error fetching auth user", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch tribers whenever currentPage or authUser changes.
  useEffect(() => {
    if (!authUser) return;
    const fetchFriendList = async () => {
      try {
        setLoadingMore(true);
        // Note: getFriendList now expects (userId, page)
        const data = await getFriendList(authUser._id, currentPage);
        if (currentPage === 1) {
          setUsers(data.requests);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...data.requests]);
        }
        // If fewer than expected friend list items are returned, assume no more items.
        if (data.requests.length < usersPerPage) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching friend list", error);
      } finally {
        setLoadingMore(false);
      }
    };
    fetchFriendList();
  }, [currentPage, authUser]);
  
  // Infinite scrolling: Load more friend list items when reaching near the bottom (only when the "tribers" tab is active)
  useEffect(() => {
    const handleScroll = () => {
      if (activeTab !== "tribers" || loadingMore || !hasMore) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab, loadingMore, hasMore]);

  // Fetch friend requests when "requests" tab is active.
  useEffect(() => {
    if (activeTab === "requests" && authUser) {
      const fetchRequests = async () => {
        try {
          const data = await getFriendRequests(authUser._id);
          setFriendRequests(data.requests);
        } catch (error) {
          console.error("Error fetching friend requests", error);
        }
      };
      fetchRequests();
    }
  }, [activeTab, authUser]);

    const handleStartChat = async (userId) => {
      if (!authUser) {
        console.error("User not authenticated");
        return;
      }
      try {
        const { chatLobbyId } = await createChatLobbyRequest(authUser._id, userId);
        window.location.href = `/profile/chat`;
      } catch (error) {
        console.error("Error starting chat", error);
      }
    };

  // Fetch blocked users when "blocked" tab is active.
  useEffect(() => {
    if (activeTab === "blocked" && authUser) {
      const fetchBlocked = async () => {
        try {
          const blockedList = await getAllBlockedForUserAPI(authUser._id);
          setBlockedUsers(blockedList);
        } catch (error) {
          console.error("Error fetching blocked users", error);
        }
      };
      fetchBlocked();
    }
  }, [activeTab, authUser]);

  // Modal handling for reporting or blocking.
  const openModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalType("");
    setReportDescription("");
    setReportReason("spam");
  };

  // Send friend request.
  const handleFriendRequest = async (userId) => {
    if (!authUser) {
      console.error("User not authenticated");
      return;
    }
    try {
      await removeFriend(userId, authUser._id);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          getUserId(user) === userId
            ? { ...user, friendRequested: true }
            : user
        )
      );
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Toggle block/unblock status.
  const handleBlock = async (userId) => {
    if (!authUser) {
      console.error("User not authenticated");
      return;
    }
    try {
      const user = users.find((u) => getUserId(u) === userId);
      if (user.blocked) {
        await unblockUser(userId, authUser._id);
      } else {
        await blockUser(userId, authUser._id);
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          getUserId(user) === userId
            ? { ...user, blocked: !user.blocked }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating block status", error);
    }
    closeModal();
  };

  const handleUnblock = async (user) => {
    if (!authUser) {
      console.error("User not authenticated");
      return;
    }
    try {
      await unblockUser(getUserId(user), authUser._id);
      setBlockedUsers((prevUsers) =>
        prevUsers.filter((u) => getUserId(u) !== getUserId(user))
      );
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  // Accept a friend request.
  const handleAcceptRequest = async (requestId) => {
    if (!authUser) {
      console.error("User not authenticated");
      return;
    }
    try {
      await acceptFriendRequest(requestId, authUser._id);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      console.error("Error accepting friend request", error);
    }
  };

  // Reject a friend request.
  const handleRejectRequest = async (requestId) => {
    if (!authUser) {
      console.error("User not authenticated");
      return;
    }
    try {
      await rejectFriendRequest(requestId, authUser._id);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );
    } catch (error) {
      console.error("Error rejecting friend request", error);
    }
  };

  // Submit a report.

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tribers-container">
      {/* Header with More Tribers button */}
      <div
        className="header-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
          {/* Optional title or left-side content can go here */}
        </div>
        <div>
          <a
            className="btn btn-primary"
            href="/profile/tribers"
          >
            More Tribers
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <ul className="tab-list">
          <li
            className={`tab-item ${activeTab === "tribers" ? "active" : ""}`}
            onClick={() => setActiveTab("tribers")}
          >
            MyTribers
          </li>
          <li
            className={`tab-item ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </li>
          <li
            className={`tab-item ${activeTab === "blocked" ? "active" : ""}`}
            onClick={() => setActiveTab("blocked")}
          >
            Blocked
          </li>
        </ul>
      </div>

      {/* Content Section */}
      {activeTab === "tribers" ? (
        <>
          {users.map((friend) => (
            <div key={getUserId(friend)} className="tribers-profile">
               <Link href={`/profile/tribers/${friend._id}`}>
              <div className="tribers-user-info">
                <img
                  src={
                    friend?.profile_pic ||
                    "/assets/admin_assets/img/users/user.png"
                  }
                  className="tribers-avatar"
                  alt={friend.username}
                />
                <div>
                  <span className="tribers-user-name">
                    {friend.firstName} {friend.lastName}
                  </span>
                  <span className="tribers-user-role">@{friend.username}</span>
                </div>
              </div>
              </Link>
              <div className="tribers-actions">
                <a href="#" onClick={() => handleStartChat(getUserId(friend))}>
                  <i className="fa fa-comment"></i>
                </a>
                <a
                  href="#"
                  onClick={() => handleFriendRequest(getUserId(friend))}
                >
                  <i
                    className={`fa ${
                      friend.friendRequested ? "fa-check" : "fa-user-minus"
                    }`}
                  ></i>
                </a>
                <a
                  href="#"
                  onClick={() => openModal(friend, "Block")}
                  className={friend.blocked ? "blocked" : ""}
                >
                  <i
                    className="fa fa-ban"
                    style={{ color: friend.blocked ? "red" : "inherit" }}
                  ></i>
                </a>
              </div>
            </div>
          ))}
          {loadingMore && <p>Loading more friends...</p>}
          {!hasMore && <p>No more tribers to load.</p>}
        </>
      ) : activeTab === "requests" ? (
        <div className="friend-requests">
          <h3>Friend Requests</h3>
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <div key={request.id} className="tribers-profile">
                 <Link href={`/profile/tribers/${request._id}`}>
                <div className="tribers-user-info">
                  <img
                    src={request.avatar}
                    className="tribers-avatar"
                    alt={request.name}
                  />
                  <div>
                    <span className="tribers-user-name">
                      {request.name}
                    </span>
                    <span className="tribers-user-role">
                      @{request.username}
                    </span>
                  </div>
                </div>
                </Link>
                <div className="friend-request-actions">
                  <button onClick={() => handleAcceptRequest(request._id)}>
                    <i className="fa fa-check" style={{ color: "green" }}></i>
                  </button>
                  <button onClick={() => handleRejectRequest(request._id)}>
                    <i className="fa fa-times" style={{ color: "red" }}></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No triber requests.</p>
          )}
        </div>
      ) : activeTab === "blocked" ? (
        <div className="blocked-users">
          <h3>Blocked Users</h3>
          {blockedUsers.length > 0 ? (
            blockedUsers.map((user) => (
              <div key={getUserId(user)} className="tribers-profile">
                <div className="tribers-user-info">
                  <img
                    src={
                      user?.profile_pic ||
                      "/assets/admin_assets/img/users/user.png"
                    }
                    className="tribers-avatar"
                    alt={user.username}
                  />
                  <div>
                    <span className="tribers-user-name">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="tribers-user-role">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div className="tribers-actions">
                  <i
                    className="fa fa-ban"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleUnblock(user)}
                    title="Unblock User"
                  ></i>
                </div>
              </div>
            ))
          ) : (
            <p>No blocked Tribers.</p>
          )}
        </div>
      ) : null}

      {/* Modal for Report / Block actions */}
    
    </div>
  );
};

export default UserList;
