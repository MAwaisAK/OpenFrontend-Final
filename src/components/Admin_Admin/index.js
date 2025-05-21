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

const initialNewAdmin = {
  username: "",
  password: "",
  role: "admin",
  level: "community",
  email: "",
  sendEmail: false, // <— always present
};

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
      if (me.level !== "super") {
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
    const loadAdmins = async (level) => {
      try {
        const data = await fetchAllAdmins(level);
        setAdmins(data);
      } catch (err) {
        console.error("Failed to load admins", err);
      }
    };

    if (me?.level) {
      loadAdmins(me.level);
    }
  }, [me]);

  // Create Admin form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState(initialNewAdmin);
  const [createError, setCreateError] = useState(""); // ← new state

  const handleCreateToggle = () => {
    setShowCreateForm((v) => !v);
    setNewAdmin(initialNewAdmin); // <— reset including sendEmail:false
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreateError("");
      const { admin: created } = await createAdmin(newAdmin, me.level);
      setAdmins((prev) => [...prev, created]);
      handleCreateToggle();
      alert("Admin created.");
    } catch (err) {
      console.error(err);
      // if the API responded with Boom.conflict
      const msg = err?.response?.data?.message || "Error creating admin.";
      setCreateError(msg);
    }
  };

  // Edit Admin
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editAdminData, setEditAdminData] = useState({
    username: "",
    level: "community",
    email: "",
  });

  const startEdit = (admin) => {
    setEditingAdminId(admin._id);
    setEditAdminData({
      username: admin.username,
      level: admin.level,
      email: admin.email || "",
    });
    setChangingPasswordId(null);
  };
  const cancelEdit = () => setEditingAdminId(null);
  const handleEditChange = (field, value) =>
    setEditAdminData((p) => ({ ...p, [field]: value }));

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const original = admins.find((x) => x._id === editingAdminId);
    const superCount = admins.filter((x) => x.level === "super").length;

    // if they’re the last super and you’re trying to change them…
    if (
      original.level === "super" &&
      superCount === 1 &&
      editAdminData.level !== "super"
    ) {
      return alert("You must keep at least one Super Admin.");
    }
    try {
      await updateAdminCredentials(
        {
          adminId: editingAdminId,
          username: editAdminData.username,
          email: editAdminData.email,
        },
        me.level
      );
      console.log(editingAdminId, editAdminData.level);
      await updateAdminRole(
        { adminId: editingAdminId, newlevel: editAdminData.level },
        me.level
      );
      setAdmins((prev) =>
        prev.map((a) =>
          a._id === editingAdminId
            ? {
              ...a,
              username: editAdminData.username,
              level: editAdminData.level,
              email: editAdminData.email,
            }
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
      await deleteAdmin(id, me.level);
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
        me.level
      );
      setChangingPasswordId(null);
      alert("Password changed.");
    } catch (err) {
      console.error(err);
      alert("Error changing password.");
    }
  };
  const superCount = admins.filter((a) => a.level === "super").length;

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
                {createError && (
                  <div className="alert alert-danger">{createError}</div>
                )}
                <div className="mb-2">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className={`form-control ${createError ? "is-invalid" : ""
                      }`}
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
                  <label className="form-label">Level</label>
                  <select
                    className="form-select"
                    value={newAdmin.level}
                    onChange={(e) =>
                      setNewAdmin((p) => ({ ...p, level: e.target.value }))
                    }
                  >
                    <option value="community">Community Admin</option>
                    <option value="super">Super Admin</option>
                    <option value="finance">Finance Admin</option>
                    <option value="ai">Ai Admin</option>
                  </select>
                </div>
                <label>Designated Email (optional)</label>
                <input
                  type="email"
                  className="form-control mb-2"
                  value={newAdmin.email}
                  onChange={(e) =>
                    setNewAdmin((p) => ({ ...p, email: e.target.value }))
                  }
                />

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    className="form-check-input"
                    checked={newAdmin.sendEmail} // controlled
                    onChange={(e) =>
                      setNewAdmin((p) => ({
                        ...p,
                        sendEmail: e.target.checked,
                      }))
                    }
                  />
                  <label htmlFor="sendEmail" className="form-check-label ml-0">
                    Send credentials via email
                  </label>
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
                admins.map((a) => {
                  // ✅ Now valid: this is inside a function block
                  const isLastSuper = a.level === "super" && superCount === 1;
                  const original = a;
                  const hasChanges =
                    editAdminData.username !== original.username ||
                    editAdminData.email !== (original.email || "") ||
                    editAdminData.level !== original.level;

                  return (
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
                                <label className="form-label">Level</label>
                                <select
                                  className="form-select"
                                  value={editAdminData.level}
                                  onChange={(e) =>
                                    handleEditChange("level", e.target.value)
                                  }
                                  disabled={isLastSuper}
                                >
                                  <option value="community">
                                    Community Admin
                                  </option>
                                  <option value="super">Super Admin</option>
                                  <option value="finance">Finance Admin</option>
                                  <option value="ai">Ai Admin</option>
                                </select>
                              </div>
                              <div className="mb-2">
                                <label className="form-label">
                                  Designated Email
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  value={editAdminData.email}
                                  onChange={(e) =>
                                    handleEditChange("email", e.target.value)
                                  }
                                />
                              </div>
                              {isLastSuper && (
                                <div className="form-text text-warning">
                                  Cannot demote the only Super Admin.
                                </div>
                              )}
                              <button
                                type="submit"
                                className="btn btn-success me-2"
                              >
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
                                <label className="form-label">
                                  New Password
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                  required
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-success me-2"
                              >
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
                              <p className="card-text">
                                <strong>Designated Email: </strong>{" "}
                                {a.email || "Not Assigned"}
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
                                {!(
                                  // hide if this is a super-admin and it's the only one
                                  (a.level === "super" && superCount === 1)
                                ) && (
                                    <button
                                      className="btn btn-danger"
                                      onClick={() => handleDelete(a._id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admins;
