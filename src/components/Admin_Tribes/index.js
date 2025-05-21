"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Script from "next/script";
import Resources from "../Admin_Scripts";
import { fetchAllTribes, fetchMe } from "@/app/api";
import '../../styles/admin_assets/bundles/datatables/datatables.min.css';
import '../../styles/admin_assets/bundles/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css';
import { useRouter } from "next/navigation"; // Next.js 13+ router

const Tribes = () => {
  const [tribes, setTribes] = useState([]);
  const [selectedTribes, setSelectedTribes] = useState([]);
  const [me, setMe] = useState(null); // <- new state for current user
  const [loading, setLoading] = useState(true); // <- new state for current user
  const [loading2, setLoading2] = useState(true); // <- new state for current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetchMe();
        setMe(response); // assuming response contains user object directly
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false); // <- Move here to ensure it always runs after fetch
      }
    };

    getCurrentUser();
  }, []);


  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (me && (me.level !== "super" && me.level !== "community")) {
        router.push("/admin/opulententrepreneurs/open/dashboard");
      } else {
        setLoading2(false); // Only allow render when authorized
      }
    }
  }, [me, loading]);



  // Fetch tribes data when the component mounts
  useEffect(() => {
    const getTribes = async () => {
      try {
        const data = await fetchAllTribes();
        const mappedTribes = data.map(tribe => {
          const averageRating =
            tribe.ratings?.length
              ? tribe.ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0) / tribe.ratings.length
              : 0;

          return {
            ...tribe,
            rating: averageRating.toFixed(1) // optional: round to 1 decimal
          };
        });
        setTribes(mappedTribes);
      } catch (error) {
        console.error("Error fetching tribes:", error);
      }
    };
    getTribes();
  }, []);

  // Initialize DataTables once data is loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.$ && window.$.fn && window.$.fn.DataTable) {
      if (window.$.fn.DataTable.isDataTable('#table-1')) {
        window.$('#table-1').DataTable().destroy();
      }
      window.$('#table-1').DataTable();
    }
  }, [tribes]);

  // Inline styles for truncating text and for checkbox column
  const truncateStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };

  const checkboxStyle = {
    width: "20px",
    textAlign: "center"
  };

  // Handler for single deletion
  const handleDelete = async (tribeId) => {
    if (!confirm("Are you sure you want to delete this tribe?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/${tribeId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Tribe deleted successfully.");
      setTribes((prevTribes) => prevTribes.filter((t) => t._id !== tribeId));
      setSelectedTribes((prev) => prev.filter((id) => id !== tribeId));
    } catch (error) {
      console.error("Error deleting tribe:", error);
      alert("Error deleting tribe.");
    }
  };

  // Handler for multi deletion
  const handleMultiDelete = async () => {
    if (selectedTribes.length === 0) {
      alert("No tribes selected.");
      return;
    }
    if (!confirm("Are you sure you want to delete the selected tribes?")) return;
    try {
      await Promise.all(
        selectedTribes.map((tribeId) =>
          axios.delete(
            `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/${tribeId}`,
            { headers: { "Content-Type": "application/json" } }
          )
        )
      );
      alert("Selected tribes deleted successfully.");
      setTribes((prevTribes) =>
        prevTribes.filter((t) => !selectedTribes.includes(t._id))
      );
      setSelectedTribes([]);
    } catch (error) {
      console.error("Error deleting tribes:", error);
      alert("Error deleting tribes.");
    }
  };

  // Handler for individual checkbox selection for bulk actions
  const handleCheckboxChange = (tribeId, checked) => {
    if (checked) {
      setSelectedTribes((prev) => [...prev, tribeId]);
    } else {
      setSelectedTribes((prev) => prev.filter((id) => id !== tribeId));
    }
  };

  // Handler for "select all" checkbox
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = tribes.map((t) => t._id);
      setSelectedTribes(allIds);
    } else {
      setSelectedTribes([]);
    }
  };

  // Handler for individual status toggle update
  const handleToggleStatus = async (tribeId, checked) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/update-status`,
        { tribeIds: [tribeId], newStatus: checked },
        { headers: { "Content-Type": "application/json" } }
      );
      // Update the local state to reflect the new status
      setTribes((prevTribes) =>
        prevTribes.map((t) =>
          t._id === tribeId ? { ...t, status: checked } : t
        )
      );
    } catch (error) {
      console.error("Error updating tribe status:", error);
      alert("Error updating tribe status.");
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
                {/* Bulk action button */}
                <div className="row mb-3">
                  <div className="col-12 d-flex gap-2">
                    <a className="btn btn-primary" href="/admin/opulententrepreneurs/open/tribes/create">
                      Create Tribe
                    </a>
                    <button className="btn btn-danger" onClick={handleMultiDelete}>
                      Delete Selected
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>Tribes</h4>
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
                                    checked={selectedTribes.length === tribes.length && tribes.length > 0}
                                  />
                                </th>
                                <th className="text-center">Id</th>
                                <th>Title</th>
                                <th style={truncateStyle}>Thumbnail</th>
                                <th style={truncateStyle}>Short Description</th>
                                <th style={truncateStyle}>Rating</th>
                                <th style={truncateStyle}>Business Category</th>
                                <th style={truncateStyle}>Status</th>
                                <th>Date Added</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tribes.map((t, index) => (
                                <tr key={t._id || index}>
                                  <td className="text-center" style={checkboxStyle}>
                                    <input
                                      type="checkbox"
                                      checked={selectedTribes.includes(t._id)}
                                      onChange={(e) =>
                                        handleCheckboxChange(t._id, e.target.checked)
                                      }
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>{t.title}</td>
                                  <td style={truncateStyle}>
                                    <img
                                      alt="tribe thumbnail"
                                      src={t.thumbnail}
                                      width={50}
                                      height={50}
                                      style={{ borderRadius: "100%" }}
                                    />
                                  </td>
                                  <td style={truncateStyle}>{t.shortDescription}</td>
                                  <td>{t.rating ? `${t.rating} ⭐` : "No ratings yet"}</td>

                                  <td style={truncateStyle}>{t.tribeCategory}</td>
                                  <td style={truncateStyle}>
                                    <input
                                      type="checkbox"
                                      checked={t.status}
                                      onChange={(e) =>
                                        handleToggleStatus(t._id, e.target.checked)
                                      }
                                    />
                                  </td>
                                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                                  <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <a
                                      href={`/admin/opulententrepreneurs/open/tribes/edit/${t._id}`}
                                      className="btn btn-warning"
                                    >
                                      Edit
                                    </a>
                                    <a
                                      onClick={() => handleDelete(t._id)}
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

export default Tribes;
