"use client";

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Script from "next/script";
import Resources from "../Admin_Scripts";
import {
  fetchAllPayments,
  updatePaymentStatus,
  refundPayment,
  fetchMe,
} from "@/app/api";
import "datatables.net-bs4";
import "../../styles/admin_assets/bundles/datatables/datatables.min.css";
import "../../styles/admin_assets/bundles/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [me, setMe] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Track when the DataTables JS has loaded
  const [dtScriptLoaded, setDtScriptLoaded] = useState(false);
  // Prevent re‑initializing
  const [dtInitialized, setDtInitialized] = useState(false);

  const dtRef = useRef(null);
  const isSuperAdmin = me?.level === "admin";

  // 1) Fetch current user
  useEffect(() => {
    fetchMe()
      .then((user) => setMe(user))
      .catch((err) => console.error("Error fetching current user:", err));
  }, []);

  // 2) Fetch payments
  useEffect(() => {
    fetchAllPayments()
      .then((res) => setPayments(res.payments))
      .catch((err) => console.error("Error fetching payments:", err));
  }, []);

  // 3) When DataTables script loads:
  //    mark it so we know we can call $.fn.DataTable
  //    (Script’s onLoad only fires once after inject)
  const handleDtLoad = () => setDtScriptLoaded(true);

  // 4) Initialize DataTable exactly once, as soon as we have:
  //      • the JS loaded  (dtScriptLoaded)
  //      • row data        (payments.length > 0)
  useEffect(() => {
    if (
      dtScriptLoaded &&
      payments.length > 0 &&
      !dtInitialized &&
      window.$?.fn?.DataTable
    ) {
      dtRef.current = window.$("#table-1").DataTable({
        // you can pass any DataTables options here
        // e.g. paging: true, pageLength: 10, ordering: true, etc.
      });
      setDtInitialized(true);
    }
  }, [dtScriptLoaded, payments, dtInitialized]);

  // 5) Clean up on unmount
  useEffect(() => {
    return () => {
      if (dtInitialized && dtRef.current) {
        dtRef.current.destroy(true);
      }
    };
  }, [dtInitialized]);

  // 6) Apply your statusFilter via DataTables API
  useEffect(() => {
    if (!dtRef.current) return;

    if (statusFilter === "all") {
      dtRef.current.column(8).search("").draw();
    } else {
      // exact match, regex=true
      dtRef.current
        .column(8)
        .search(`^${statusFilter}$`, true, false)
        .draw();
    }
  }, [statusFilter]);

  // 7) Handlers
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePaymentStatus(id, newStatus);
      setPayments((ps) =>
        ps.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
      alert("Payment status updated.");
    } catch (e) {
      console.error(e);
      alert("Failed to update status.");
    }
  };

  const handleRefund = async (id) => {
    if (!confirm("Refund this payment?")) return;
    try {
      await refundPayment(id);
      setPayments((ps) =>
        ps.map((p) => (p._id === id ? { ...p, status: "refunded" } : p))
      );
      alert("Refund successful.");
    } catch (e) {
      console.error(e);
      alert("Failed to refund.");
    }
  };

  return (
    <>
      <Resources />

      {/* load DataTables after React mounts */}
      <Script
        src="/assets/admin_assets/bundles/datatables/datatables.min.js"
        strategy="afterInteractive"
        onLoad={handleDtLoad}
      />

      {/* any other scripts */}
      <Script
        src="/assets/admin_assets/bundles/jquery-selectric/jquery.selectric.min.js"
        strategy="beforeInteractive"
      />
      {/* … other Script tags … */}

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
                        <h4>Payments</h4>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label
                            htmlFor="statusFilter"
                            className="form-label"
                          >
                            Filter by Status:
                          </label>
                          <select
                            id="statusFilter"
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) =>
                              setStatusFilter(e.target.value)
                            }
                            style={{ maxWidth: "250px" }}
                          >
                            <option value="all">All</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="refunded">Refunded</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="table-responsive">
                          <table
                            className="table table-striped"
                            id="table-1"
                          >
                           <thead>
                            <tr>{[
                              <th key="0" className="text-center">#</th>,
                              <th key="1">Payment ID</th>,
                              <th key="2">User</th>,
                              <th key="3">Type</th>,
                              <th key="4">Info</th>,
                              <th key="5">Amount</th>,
                              <th key="6">Date</th>,
                              <th key="7">Status</th>,
                              <th key="8" style={{ display: "none" }}>Raw Status</th>,
                              <th key="9">Action</th>,
                            ]}</tr>
                          </thead>

                          <tbody>
                            {payments.map((p, i) => {
                              const cells = [
                                <td key="0">{i + 1}</td>,
                                <td key="1">{p.paymentid || "N/A"}</td>,
                                <td key="2">{p.user?.username || "N/A"}</td>,
                                <td key="3">{p.data || "N/A"}</td>,
                                <td key="4">
                                  {p.data === "basic"  || p.data === "premium"
                                    ? p.period
                                    : p.data === "course"
                                    ? p.courseTitle
                                    : ["small","large","custom"].includes(p.data)
                                    ? p.tokens
                                    : "N/A"}
                                </td>,
                                <td key="5">{p.payment || "N/A"}</td>,
                                <td key="6">{new Date(p.createdAt).toLocaleString()}</td>,
                                <td key="7">
                                  <select
                                    value={p.status}
                                    onChange={e => handleStatusChange(p._id, e.target.value)}
                                    className="form-control"
                                    style={{ minWidth: 120 }}
                                  >
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>,
                                <td key="8" style={{ display: "none" }}>{p.status}</td>,
                                <td key="9" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                  <button
                                    className="btn btn-info"
                                    onClick={() => handleRefund(p._id)}
                                    disabled={p.status === "refunded" || !isSuperAdmin}
                                    style={{
                                      backgroundColor:
                                        p.status === "refunded" || !isSuperAdmin ? "grey" : undefined,
                                      borderColor:
                                        p.status === "refunded" || !isSuperAdmin ? "grey" : undefined,
                                      cursor:
                                        p.status === "refunded" || !isSuperAdmin ? "not-allowed" : undefined,
                                    }}
                                  >
                                    Refund
                                  </button>
                                </td>,
                              ];
                              return <tr key={p._id}>{cells}</tr>;
                            })}
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

export default Payment;
