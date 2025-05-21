"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import Script from "next/script";
import { fetchUsers, updateUsers, fetchMe, deleteUserById } from "@/app/api";
import '../../styles/admin_assets/bundles/datatables/datatables.min.css';
import '../../styles/admin_assets/bundles/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css';
import { useRouter } from "next/navigation"; // Next.js 13+ router


const API_BASE = process.env.NEXT_PUBLIC_BASE_ENDPOINT;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  // Store per-user update values keyed by user ID.
  const [userUpdates, setUserUpdates] = useState({});
  // Store selected user IDs for bulk actions.
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  // Bulk token change value (e.g., "+50" or "-20")
  const [bulkTokenChange, setBulkTokenChange] = useState("");

  const [me, setMe] = useState(null); // <- new state for current user

  // Fetch current user on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetchMe();
        setMe(response); // assuming response contains user object directly
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    getCurrentUser();
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (me && me.level !== "super" && me.level !== "community" && me.level !== "finance") {
      router.push("/admin/opulententrepreneurs/open/dashboard");
    }
  }, [me]);

  const showTokensAndSubscription = me?.level === "super" || me?.level === "finance";
  const showStatusAndAction = me?.level === "super" || me?.level === "community";
  const isSuperAdmin = me?.level === "super";


  // Fetch all users on mount using fetchUsers API function.
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsers();
        // Assume response.users contains an array of users; if not, fallback to response directly.
        const fetchedUsers = response.users || response;
        setUsers(fetchedUsers);

        // Initialize update values for each user.
        const initialUpdates = {};
        fetchedUsers.forEach((user) => {
          initialUpdates[user._id] = {
            tokenChange: "", // relative change string, e.g., "+50" or "-20"
            subscription: user.subscription || "none",
            role: user.role || "user",
            level: user.level || "admin", // default for admins; ignored for non-admins.
            status: user.status || "active",
          };
        });
        setUserUpdates(initialUpdates);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    // simple confirmation
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserById(userId);
      // remove from local state
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user. Please try again.");
    }
  };


  // Handler for checkbox selection per row.
  const handleCheckboxChange = (userId, checked) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, userId]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  // Handler for input changes (token update or dropdowns).
  const handleInputChange = (userId, field, value) => {
    setUserUpdates((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], [field]: value },
    }));
  };

  // Handler for updating an individual user.
  const handleUpdateUser = async (userId) => {
    try {
      // Get the current user details.
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      const updates = userUpdates[userId] || {};
      const updateData = {};

      // Process tokenChange input.
      if (
        updates.tokenChange &&
        (updates.tokenChange.startsWith("+") || updates.tokenChange.startsWith("-"))
      ) {
        const delta = parseInt(updates.tokenChange, 10);
        if (!isNaN(delta)) {
          updateData.tokens = (user.tokens || 0) + delta;
        }
      }

      updateData.subscription = updates.subscription;
      updateData.role = updates.role;
      // Only update level if role is admin.
      if (updates.role === "admin") {
        updateData.level = updates.level;
      }
      updateData.status = updates.status;

      // Call updateUsers API function (PUT /auth/userupdate/:userId).
      const response = await updateUsers(userId, updateData);
      alert("User updated successfully.");

      // Optionally update local state with the updated user.
      const updatedUser = response.data.data || response.data;
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? updatedUser : u))
      );
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please try again.");
    }
  };

  // Handler for bulk token update for all selected users.
  const handleBulkTokenUpdate = async () => {
    if (!bulkTokenChange) return;
    if (!(bulkTokenChange.startsWith("+") || bulkTokenChange.startsWith("-"))) {
      alert("Please enter a valid value (e.g., +50 or -20).");
      return;
    }
    const delta = parseInt(bulkTokenChange, 10);
    if (isNaN(delta)) {
      alert("Invalid number entered.");
      return;
    }

    try {
      const updatePromises = selectedUserIds.map(async (userId) => {
        const user = users.find((u) => u._id === userId);
        if (!user) return;
        const newTokens = (user.tokens || 0) + delta;
        const response = await updateUsers(userId, { tokens: newTokens });
        return response.data.data || response.data;
      });
      const updatedUsers = await Promise.all(updatePromises);
      alert("Bulk token update successful.");

      // Update local state with updated users.
      setUsers((prev) =>
        prev.map((u) => {
          const updatedUser = updatedUsers.find((uu) => uu && uu._id === u._id);
          return updatedUser ? updatedUser : u;
        })
      );
      // Reset bulk token input.
      setBulkTokenChange("");
    } catch (error) {
      console.error("Error in bulk token update:", error);
      alert("Error updating tokens in bulk.");
    }
  };

  // Initialize or reinitialize DataTable when users data changes.
  useEffect(() => {
    if (typeof window !== "undefined" && window.$ && window.$.fn && window.$.fn.DataTable) {
      if (window.$.fn.DataTable.isDataTable('#table-users')) {
        window.$('#table-users').DataTable().destroy();
      }
      window.$('#table-users').DataTable();
    }
  }, [users]);

  return (
    <>
      <Resources />
      <Script src="/assets/admin_assets/bundles/jquery-selectric/jquery.selectric.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/upload-preview/assets/js/jquery.uploadPreview.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/summernote/summernote-bs4.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/js/page/create-post.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/datatables/datatables.min.js" strategy="afterInteractive" />

      <div id="app">
        <div className="main-wrapper main-wrapper-1">
          <div className="navbar-bg"></div>
          <Navbar />
          <Sidebar />
          <div className="main-content">
            <section className="section">
              <div className="section-body">
                <h4>User Management</h4>
                {/* Bulk Token Update Input Box at Top Right */}
                <div style={{ textAlign: "right", marginBottom: "10px" }}>
                  <input
                    type="text"
                    placeholder="e.g., +50 or -20"
                    value={bulkTokenChange}
                    onChange={(e) => setBulkTokenChange(e.target.value)}
                    style={{ width: "150px", marginRight: "10px" }}
                  />
                  <button className="btn btn-primary" onClick={handleBulkTokenUpdate}>
                    Update Selected Tokens
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped" id="table-users">
                    <thead>
                      <tr>
                        <th className="text-center">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (checked) {
                                setSelectedUserIds(users.map((u) => u._id));
                              } else {
                                setSelectedUserIds([]);
                              }
                            }}
                            checked={selectedUserIds.length === users.length && users.length > 0}
                            disabled={!isSuperAdmin}
                          />
                        </th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Profile</th>
                        <th>Email</th>
                        {showTokensAndSubscription && <th>Tokens</th>}
                        {showTokensAndSubscription && <th>Subscription</th>}
                        {showStatusAndAction && <th>Status</th>}
                        {showStatusAndAction && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => {
                          const updates = userUpdates[user._id] || {};
                          return (
                            <tr key={user._id}>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedUserIds.includes(user._id)}
                                  onChange={(e) =>
                                    handleCheckboxChange(user._id, e.target.checked)
                                  }
                                  disabled={!isSuperAdmin}
                                />
                              </td>
                              <td>{user.username}</td>
                              <td>{user.firstName} {user.lastName}</td>
                              <td>
                                <img
                                  alt="user profile"
                                  src={user.profile_pic || '../../../assets/admin_assets/img/users/user.png'}
                                  width={50}
                                  height={50}
                                  style={{ borderRadius: "100%" }}
                                />
                              </td>
                              <td>{user.email}</td>
                              {showTokensAndSubscription && (
                                <>
                                  <td>
                                    <div>
                                      <span>{user.tokens || 0}</span>
                                      <input
                                        type="text"
                                        value={userUpdates[user._id]?.tokenChange || ""}
                                        onChange={(e) =>
                                          handleInputChange(user._id, "tokenChange", e.target.value)
                                        }
                                        placeholder="e.g. +50"
                                        style={{ width: "80px", marginLeft: "10px" }}
                                        disabled={!isSuperAdmin}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <select
                                      value={userUpdates[user._id]?.subscription || "none"}
                                      onChange={(e) =>
                                        handleInputChange(user._id, "subscription", e.target.value)
                                      }
                                      className="form-select"
                                      disabled={!isSuperAdmin}
                                    >
                                      <option value="none">None</option>
                                      <option value="basic">Basic</option>
                                      <option value="premium">Premium</option>
                                    </select>
                                  </td>
                                </>
                              )}

                              {showStatusAndAction && (
                                <>
                                  <td>
                                    <select
                                      value={userUpdates[user._id]?.status || user.status || "active"}
                                      onChange={(e) =>
                                        handleInputChange(user._id, "status", e.target.value)
                                      }
                                      className="form-select"
                                      disabled={!isSuperAdmin}
                                    >
                                      <option value="active">Active</option>
                                      <option value="inactive">Inactive</option>
                                    </select>
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handleUpdateUser(user._id)}
                                    >
                                      Update
                                    </button>
                                    {isSuperAdmin && (
                                      <button
                                        className="btn btn-danger btn-sm ml-2"
                                        onClick={() => handleDeleteUser(user._id)}
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;