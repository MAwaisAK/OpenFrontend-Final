"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import {
  fetchAllAdmins,
  createAdmin,
  updateAdminCredentials,
  updateAdminRole,
  deleteAdmin,
  fetchMe,
} from "@/app/api";

const Admins = () => {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [me, setMe] = useState(null);

  // Authentication check
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

  useEffect(() => {
    if (!loading && me) {
      if (me.level !== "admin") {
        setRedirecting(true);
        router.replace("/admin/opulententrepreneurs/open/dashboard");
      }
    }
  }, [loading, me, router]);

  // Access token
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Load admins
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await fetchAllAdmins(accessToken);
        setAdmins(data);
      } catch (err) {
        console.error("Failed to load admins", err);
      }
    };
    if (accessToken) {
      loadAdmins();
    }
  }, [accessToken]);

  // Create Admin form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    role: "moderator",
  });

  const handleCreateToggle = () => {
    setShowCreateForm((v) => !v);
    setNewAdmin({ username: "", password: "", role: "moderator" });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const { admin: created } = await createAdmin(newAdmin, accessToken);
      setAdmins((prev) => [...prev, created]);
      handleCreateToggle();
      alert("Admin created.");
    } catch (err) {
      console.error(err);
      alert("Error creating admin.");
    }
  };

  // Edit Admin
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editAdminData, setEditAdminData] = useState({
    username: "",
    role: "moderator",
  });

  const startEdit = (admin) => {
    setEditingAdminId(admin._id);
    setEditAdminData({
      username: admin.username,
      role: admin.role,
    });
    setChangingPasswordId(null);
  };
  const cancelEdit = () => setEditingAdminId(null);
  const handleEditChange = (field, value) =>
    setEditAdminData((p) => ({ ...p, [field]: value }));

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await updateAdminCredentials(
        { adminId: editingAdminId, username: editAdminData.username },
        accessToken
      );
      await updateAdminRole(
        { adminId: editingAdminId, newRole: editAdminData.role },
        accessToken
      );
      setAdmins((prev) =>
        prev.map((a) =>
          a._id === editingAdminId
            ? { ...a, username: editAdminData.username, role: editAdminData.role }
            : a
        )
      );
      setEditingAdminId(null);
      alert("Admin updated.");
    } catch (err) {
      console.error(err);
      alert("Error updating admin.");
    }
  };

  // Delete Admin
  const handleDelete = async (id) => {
    if (!confirm("Delete this admin?")) return;
    try {
      await deleteAdmin(id, accessToken);
      setAdmins((prev) => prev.filter((a) => a._id !== id));
      alert("Admin deleted.");
    } catch (err) {
      console.error(err);
      alert("Error deleting admin.");
    }
  };

  // Change password
  const [changingPasswordId, setChangingPasswordId] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const startChangePassword = (id) => {
    setChangingPasswordId(id);
    setEditingAdminId(null);
    setNewPassword("");
  };
  const cancelChangePassword = () => setChangingPasswordId(null);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdminCredentials(
        { adminId: changingPasswordId, password: newPassword },
        accessToken
      );
      setChangingPasswordId(null);
      alert("Password changed.");
    } catch (err) {
      console.error(err);
      alert("Error changing password.");
    }
  };

  if (loading || redirecting || !me) {
    return <div>Loading…</div>;
  }

  return (
    <>
      <Resources />
      <div id="app">
        <div className="main-wrapper main-wrapper-1">
          <div className="navbar-bg"></div>
          <Navbar />
          <Sidebar />
          <div className="main-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Admins</h2>
              <button className="btn btn-primary" onClick={handleCreateToggle}>
                {showCreateForm ? "Cancel" : "Create Admin"}
              </button>
            </div>

            {showCreateForm && (
              <form className="card mb-4 p-3" onSubmit={handleCreateSubmit}>
                <div className="mb-2">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAdmin.username}
                    onChange={(e) =>
                      setNewAdmin((p) => ({ ...p, username: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newAdmin.password}
                    onChange={(e) =>
                      setNewAdmin((p) => ({ ...p, password: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newAdmin.role}
                    onChange={(e) =>
                      setNewAdmin((p) => ({ ...p, role: e.target.value }))
                    }
                  >
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-success">
                  Create
                </button>
              </form>
            )}

            <div className="row">
              {admins.length === 0 ? (
                <div className="text-center w-100">
                  <p>No admins found.</p>
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateToggle}
                  >
                    Create Admin
                  </button>
                </div>
              ) : (
                admins.map((a) => (
                  <div key={a._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        {editingAdminId === a._id ? (
                          <form onSubmit={handleSaveEdit}>
                            <div className="mb-2">
                              <label className="form-label">Username</label>
                              <input
                                type="text"
                                className="form-control"
                                value={editAdminData.username}
                                onChange={(e) =>
                                  handleEditChange("username", e.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Role</label>
                              <select
                                className="form-select"
                                value={editAdminData.role}
                                onChange={(e) =>
                                  handleEditChange("role", e.target.value)
                                }
                              >
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                            <button type="submit" className="btn btn-success me-2">
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </form>
                        ) : changingPasswordId === a._id ? (
                          <form onSubmit={handleChangePasswordSubmit}>
                            <div className="mb-2">
                              <label className="form-label">New Password</label>
                              <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                              />
                            </div>
                            <button type="submit" className="btn btn-success me-2">
                              Change
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={cancelChangePassword}
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <>
                            <h5 className="card-title">{a.username}</h5>
                            <p className="card-text">
                              <strong>Password: </strong>********
                            </p>
                            <p className="card-text">
                              <strong>Level: </strong> {a.level}
                            </p>
                            <div className="d-flex">
                              <button
                                className="btn btn-warning me-2"
                                onClick={() => startEdit(a)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-info me-2"
                                onClick={() => startChangePassword(a._id)}
                              >
                                Change Password
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(a._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Admins;
