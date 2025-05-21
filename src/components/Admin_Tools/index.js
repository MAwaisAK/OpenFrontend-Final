"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Script from "next/script";
import Resources from "../Admin_Scripts";
import { fetchAllTools, fetchMe } from "@/app/api";
import '../../styles/admin_assets/bundles/datatables/datatables.min.css';
import '../../styles/admin_assets/bundles/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css';
import { useRouter } from "next/navigation";

const Tools = () => {
  const router = useRouter();
  const [me, setMe] = useState(null); // <- new state for current user
  const [loading3, setLoading3] = useState(true); // <- new state for current user
  const [loading2, setLoading2] = useState(true); // <- new state for current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetchMe();
        setMe(response); // assuming response contains user object directly
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading3(false); // <- Move here to ensure it always runs after fetch
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!loading3) {
      if (me && (me.level !== "super" && me.level !== "community")) {
        router.push("/admin/opulententrepreneurs/open/dashboard");
      } else {
        setLoading2(false); // Only allow render when authorized
      }
    }
  }, [me, loading3]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTools, setSelectedTools] = useState([]);

  // Fetch tool data when the component mounts
  useEffect(() => {
    const getTools = async () => {
      try {
        const data = await fetchAllTools();
        setTools(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };
    getTools();
  }, []);

  // Initialize DataTables once data is loaded
  useEffect(() => {
    if (!loading && typeof window !== "undefined" && window.$ && window.$.fn && window.$.fn.DataTable) {
      if (window.$.fn.DataTable.isDataTable('#table-1')) {
        window.$('#table-1').DataTable().destroy();
      }
      window.$('#table-1').DataTable();
    }
  }, [tools, loading]);

  // Inline style for truncating text
  const truncateStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };

  // Inline style for checkbox column (smaller width)
  const checkboxStyle = {
    width: "20px",
    textAlign: "center"
  };

  // Handler for single deletion
  const handleDelete = async (toolId) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/${toolId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Tool deleted successfully.");
      setTools((prevTools) => prevTools.filter((t) => t._id !== toolId));
      setSelectedTools((prev) => prev.filter((id) => id !== toolId));
    } catch (error) {
      console.error("Error deleting tool:", error);
      alert("Error deleting tool.");
    }
  };

  // Handler for bulk deletion
  const handleMultiDelete = async () => {
    if (selectedTools.length === 0) {
      alert("No tools selected.");
      return;
    }
    if (!confirm("Are you sure you want to delete the selected tools?")) return;
    try {
      await Promise.all(
        selectedTools.map((toolId) =>
          axios.delete(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/${toolId}`, { headers: { "Content-Type": "application/json" } })
        )
      );
      alert("Selected tools deleted successfully.");
      setTools((prevTools) => prevTools.filter((t) => !selectedTools.includes(t._id)));
      setSelectedTools([]);
    } catch (error) {
      console.error("Error deleting tools:", error);
      alert("Error deleting tools.");
    }
  };

  // Handler for single status toggle update.
  // When toggled, call the bulk update endpoint with a single toolId.
  const handleToggleStatus = async (toolId, checked) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/update-status`,
        { toolIds: [toolId], newStatus: checked },
        { headers: { "Content-Type": "application/json" } }
      );
      // Update local state
      setTools((prevTools) =>
        prevTools.map((t) =>
          t._id === toolId ? { ...t, status: checked } : t
        )
      );
    } catch (error) {
      console.error("Error updating tool status:", error);
      alert("Error updating tool status.");
    }
  };

  // Handler for bulk status update: update status for all selected tools.
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedTools.length === 0) {
      alert("No tools selected.");
      return;
    }
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/update-status`,
        { toolIds: selectedTools, newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Tools status updated successfully.");
      setTools((prevTools) =>
        prevTools.map((t) =>
          selectedTools.includes(t._id) ? { ...t, status: newStatus } : t
        )
      );
      setSelectedTools([]);
    } catch (error) {
      console.error("Error updating tools status:", error);
      alert("Error updating tools status.");
    }
  };

  // Handler for individual checkbox selection
  const handleCheckboxChange = (toolId, checked) => {
    if (checked) {
      setSelectedTools((prev) => [...prev, toolId]);
    } else {
      setSelectedTools((prev) => prev.filter((id) => id !== toolId));
    }
  };

  // Handler for "select all" checkbox
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = tools.map((t) => t._id);
      setSelectedTools(allIds);
    } else {
      setSelectedTools([]);
    }
  };
    if (loading2) {
    return <div className="p-4">Loading...</div>;
  }

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
                {/* Bulk action buttons */}
                <div className="row mb-3">
                  <div className="col-12 d-flex gap-2">
                    <button className="btn btn-danger" onClick={handleMultiDelete}>
                      Delete Selected
                    </button>
                    <button className="btn btn-success" onClick={() => handleBulkStatusUpdate(true)}>
                      Activate Selected
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleBulkStatusUpdate(false)}>
                      Deactivate Selected
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>Tools</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-striped" id="table-1">
                            <thead>
                              <tr>
                                <th className="text-center" style={checkboxStyle}>
                                  <input
                                    type="checkbox"
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    checked={selectedTools.length === tools.length && tools.length > 0}
                                  />
                                </th>
                                <th className="text-center">#</th>
                                <th>Tool Name</th>
                                <th>Category</th>
                                <th>Icon</th>
                                <th style={truncateStyle}>Short Description</th>
                                <th>Date Added</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tools.map((tool, index) => (
                                <tr key={tool._id || index}>
                                  <td className="text-center" style={checkboxStyle}>
                                    <input
                                      type="checkbox"
                                      checked={selectedTools.includes(tool._id)}
                                      onChange={(e) => handleCheckboxChange(tool._id, e.target.checked)}
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>{tool.title}</td>
                                  <td>{tool.toolCategory}</td>
                                  <td>
                                    <img
                                      alt="tool icon"
                                      src={tool.thumbnail}
                                      width={50}
                                      height={50}
                                      style={{ borderRadius: "100%" }}
                                    />
                                  </td>
                                  <td style={truncateStyle}>{tool.shortdescription}</td>
                                  <td>{new Date(tool.createdAt).toLocaleString()}</td>
                                  <td>
                                    {/* Status toggle switch */}
                                    <input
                                      type="checkbox"
                                      checked={tool.status === true || tool.status === "Active"}
                                      onChange={(e) => handleToggleStatus(tool._id, e.target.checked)}
                                    />
                                  </td>
                                  <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <a href={`/admin/opulententrepreneurs/open/tools/edit/${tool._id}`} className="btn btn-warning">
                                      Edit
                                    </a>
                                    <a
                                      onClick={() => handleDelete(tool._id)}
                                      className="btn btn-danger"
                                      style={{ cursor: "pointer" }}
                                    >
                                      Delete
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tools;
