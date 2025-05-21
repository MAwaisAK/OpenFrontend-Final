"use client";

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../Admin_Sidebar";
import Script from "next/script";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import { useRouter } from "next/navigation";
import { fetchSupportReports, updateSupportReportStatus, fetchMe } from "@/app/api";
import "datatables.net-bs4";
import "../../styles/admin_assets/bundles/datatables/datatables.min.css";
import "../../styles/admin_assets/bundles/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css";

const UserReports = () => {
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
        if (me && (me.level !== "super" && me.level !== "community"  && me.level !== "finance")) {
          router.push("/admin/opulententrepreneurs/open/dashboard");
        } else {
          setLoading2(false); // Only allow render when authorized
        }
      }
    }, [me, loading3]);
  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dtScriptLoaded, setDtScriptLoaded] = useState(false);
  const [dtInitialized, setDtInitialized] = useState(false);
  const dtRef = useRef(null);

  const handleDtLoad = () => setDtScriptLoaded(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await fetchSupportReports();
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReports(sorted);
      } catch (error) {
        console.error("Error fetching user reports:", error);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    if (
      dtScriptLoaded &&
      reports.length > 0 &&
      !dtInitialized &&
      window.$?.fn?.DataTable
    ) {
      dtRef.current = window.$("#table-user-reports").DataTable();
      setDtInitialized(true);
    }
  }, [dtScriptLoaded, reports, dtInitialized]);

  useEffect(() => {
    if (!dtRef.current) return;

    if (statusFilter === "all") {
      dtRef.current.column(6).search("").draw();
    } else {
      dtRef.current.column(6).search(`^${statusFilter}$`, true, false).draw();
    }
  }, [statusFilter]);

  useEffect(() => {
    return () => {
      if (dtInitialized && dtRef.current) {
        dtRef.current.destroy(true);
      }
    };
  }, [dtInitialized]);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      await updateSupportReportStatus([reportId], newStatus);
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
      alert("Status updated");
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Error updating report status.");
    }
  };

  const truncateText = (text, maxLength) =>
    text.length <= maxLength ? text : text.slice(0, maxLength) + "...";

  const handleShowMore = (description) => {
    setModalDescription(description);
    setShowModal(true);
  };
    if (loading2) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <Resources />
      <Script
        src="/assets/admin_assets/bundles/datatables/datatables.min.js"
        strategy="afterInteractive"
        onLoad={handleDtLoad}
      />
      {/* Other scripts if needed... */}

      <div id="app">
        <div className="main-wrapper main-wrapper-1">
          <div className="navbar-bg"></div>
          <Navbar />
          <Sidebar />
          <div className="main-content">
            <section className="section">
              <div className="section-body">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>User Reports</h4>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label htmlFor="statusFilter" className="form-label">
                            Filter by Status:
                          </label>
                          <select
                            id="statusFilter"
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ maxWidth: "250px" }}
                          >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="inreview">In Review</option>
                            <option value="resolved">Resolved</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        </div>

                        <div className="table-responsive">
                          <table
                            className="table table-striped"
                            id="table-user-reports"
                          >
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Subscription</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Status</th>
                                 <th>Created At</th> {/* NEW */}
                                <th style={{ display: "none" }}>Raw Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reports.length > 0 ? (
                                reports.map((report, index) => (
                                  <tr key={report._id || index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {report.user?._id ? (
                                        <a
                                          href={`/profile/tribers/${report.user._id}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {report.user.username || "N/A"}
                                        </a>
                                      ) : (
                                        "N/A"
                                      )}
                                    </td>
                                    <td>
                                      {report.user?.subscription || "N/A"}
                                    </td>
                                    <td>{report.type}</td>
                                    <td>
                                      {report.Description.length > 50 ? (
                                        <>
                                          {truncateText(report.Description, 50)}{" "}
                                          <button
                                            className="btn btn-link btn-sm"
                                            onClick={() =>
                                              handleShowMore(report.Description)
                                            }
                                          >
                                            Show More
                                          </button>
                                        </>
                                      ) : (
                                        report.Description
                                      )}
                                    </td>
                                    <td>
  {new Date(report.createdAt).toLocaleString()}
</td>

                                    <td>
                                      <select
                                        value={report.status}
                                        onChange={(e) =>
                                          handleStatusChange(
                                            report._id,
                                            e.target.value
                                          )
                                        }
                                        className="form-select"
                                      >
                                        <option value="pending">Pending</option>
                                        <option value="inreview">In Review</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="canceled">Canceled</option>
                                      </select>
                                    </td>
                                    <td style={{ display: "none" }}>
                                      {report.status}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="7" className="text-center">
                                    No reports found.
                                  </td>
                                </tr>
                              )}
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

      {/* Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-content"
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "600px",
              maxHeight: "80%",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Close button (X) in the top-right corner */}
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <h5>Description</h5>
            <p>{modalDescription}</p>
            <div className="text-end">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Show Less
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserReports;
