"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/tribe-profile.css";
import {
  getRandomUserProfiles,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  blockUser,
  unblockUser,
  getFriendRequests,
  createSupportReport,
  fetchMe,
  createChatLobbyRequest,
  searchTribers,
} from "@/app/api";

// Helper function to get user ID (either _id or id)
const getUserId = (user) => user?._id || user?.id;

const UserList = () => {
  // States for profiles, friend requests, blocked users, search, and UI controls.
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
  
  // States for search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // States for infinite scroll
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const usersPerPage = 3; // API returns 3 users per page

  // Fetch authenticated user on mount.
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

  // Fetch tribers (default list) whenever currentPage or authUser changes.
  useEffect(() => {
    if (!authUser || searchQuery) return; // do not fetch default profiles when searching
    const fetchProfiles = async () => {
      try {
        setLoadingMore(true);
        const data = await getRandomUserProfiles(currentPage, authUser._id);
        // Filter new unique users that are not already in the list
        if (currentPage === 1) {
          setUsers(data.data);
          if (data.data.length < usersPerPage) {
            setHasMore(false);
          }
        } else {
          const newUsers = data.data.filter((newUser) =>
            !users.some(
              (existingUser) =>
                getUserId(existingUser).toString() === getUserId(newUser).toString()
            )
          );
          if (newUsers.length === 0) {
            setHasMore(false);
          } else {
            setUsers((prevUsers) => [...prevUsers, ...newUsers]);
            if (newUsers.length < usersPerPage) {
              setHasMore(false);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profiles", error);
      } finally {
        setLoadingMore(false);
      }
    };
    fetchProfiles();
  }, [currentPage, authUser, searchQuery]);

  // Live search: Trigger search whenever searchQuery changes.
  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const data = await searchTribers(searchQuery);
      setSearchResults(data.data);
    } catch (error) {
      console.error("Error searching tribers:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  // Infinite scrolling: Load more profiles when near bottom (only for "tribers" tab when not searching).
useEffect(() => {
  const handleScroll = () => {
    if (activeTab !== "tribers" || loadingMore || !hasMore || searchQuery) return;
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - 100
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [activeTab, loadingMore, hasMore, searchQuery]);


  // Build an exclusion list from current user's relationships.
  const getExclusionIds = () => {
    if (!authUser) return [];
    const exclusionIds = [
      getUserId(authUser),
      ...(authUser.requests || []),
      ...(authUser.sentrequests || []),
      ...(authUser.blockedby || []),
      ...(authUser.blockedtribers || []),
      ...(authUser.mytribers || []),
    ].map(String);
    return exclusionIds;
  };

  // Filter out users in the exclusion list.
  const filteredUsers = authUser
    ? users.filter(
        (user) => !getExclusionIds().includes(getUserId(user).toString())
      )
    : users;

  // Similarly, filter search results to exclude users already related.
  const filteredSearchResults = authUser
    ? searchResults.filter(
        (user) => !getExclusionIds().includes(getUserId(user).toString())
      )
    : searchResults;

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

  // Fetch blocked users when "blocked" tab is active.
  useEffect(() => {
    if (activeTab === "blocked" && authUser) {
      const fetchBlocked = async () => {
        try {
          const blockedList = await createChatLobbyRequest(authUser._id);
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
      await sendFriendRequest(userId, authUser._id);
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

  // Submit a report.
  const handleReportSubmit = async () => {
    if (!authUser) {
      console.error("User not authenticated");
      return;
    }
    try {
      const reportData = {
        type: reportReason,
        user: authUser,
        status: "pending",
        Description: reportDescription,
      };
      await createSupportReport(reportData);
    } catch (error) {
      console.error("Error submitting support report", error);
    }
    closeModal();
  };

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tribers-container">
      {/* Search Bar */}
      <div className="triber-search-bar">
        <input
          type="text"
          placeholder="Search tribers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>
          <i className="fa fa-search"></i>
        </button>
      </div>

      {/* Display live search results if searchQuery is non-empty */}
      {searchQuery ? (
        <div className="search-results">
          {isSearching ? (
            <p>Searching...</p>
          ) : filteredSearchResults.length > 0 ? (
            filteredSearchResults.map((user) => (
              <div key={user._id} className="tribers-profile">
                <Link href={`/profile/tribers/${user._id}`}>
                  <div className="tribers-user-info">
                    <img
                      src={user.profile_pic || "/assets/admin_assets/img/users/user.png"}
                      className="tribers-avatar"
                      alt={user.username}
                    />
                    <div>
                      <span className="tribers-user-name">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="tribers-user-role">@{user.username}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      ) : (
        <>
          {/* Display tribers (filtered users) */}
          {filteredUsers.map((user) => (
            <div key={getUserId(user)} className="tribers-profile">
              <Link href={`/profile/tribers/${user._id}`}>
                <div className="tribers-user-info">
                  <img
                    src={user.profile_pic || "/assets/admin_assets/img/users/user.png"}
                    className="tribers-avatar"
                    alt={user.username}
                  />
                  <div>
                    <span className="tribers-user-name">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="tribers-user-role">@{user.username}</span>
                  </div>
                </div>
              </Link>
              <div className="tribers-actions">
                <a href="#" onClick={() => handleStartChat(getUserId(user))}>
                  <i className="fa fa-comment"></i>
                </a>
                <a href="#" onClick={() => handleFriendRequest(getUserId(user))}>
                  <i className={`fa ${user.friendRequested ? "fa-check" : "fa-user-plus"}`}></i>
                </a>
                <a
                  href="#"
                  onClick={() => openModal(user, "Block")}
                  className={user.blocked ? "blocked" : ""}
                >
                  <i className="fa fa-ban" style={{ color: user.blocked ? "red" : "inherit" }}></i>
                </a>
              </div>
            </div>
          ))}
          {hasMore && !loadingMore && (
  <div style={{ textAlign: "center", margin: "1rem 0" }}>
    <button onClick={() => setCurrentPage((prev) => prev + 1)} className="load-more-button">
      Load More
    </button>
  </div>
)}
{loadingMore && <p>Loading more tribers...</p>}
        </>
      )}

      {/* Modal for Report / Block actions */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>
              {modalType} {selectedUser?.name}
            </h4>
            {modalType === "Report" ? (
              <>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="m-4"
                >
                  <option value="spam">Spam</option>
                  <option value="abuse">Abusive Content</option>
                  <option value="fake">Fake Account</option>
                </select>
                <textarea
                  placeholder="Describe the issue..."
                  rows="4"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                ></textarea>
              </>
            ) : (
              <p>Are you sure you want to block this user?</p>
            )}
            <div className="modal-buttons">
              <button onClick={closeModal}>Cancel</button>
              {modalType === "Report" ? (
                <button onClick={handleReportSubmit}>Submit</button>
              ) : (
                <button onClick={() => handleBlock(getUserId(selectedUser))}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
