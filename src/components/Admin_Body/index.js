"use client";
import { useState, useEffect } from "react";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import {
  fetchRevenue,
  fetchLastFourReports,
  fetchTotalSignupsLast7Days,
  fetchTotalUsers,
  fetchMe,
  fetchTotalActiveTribes
} from "@/app/api"; // Adjust the import path as needed
// Import required parts from Chart.js and react-chartjs-2
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminBody = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [lastWeekRevenue, setLastWeekRevenue] = useState(0);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [last7Payments, setLast7Payments] = useState([]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("default", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [newSignups, setNewSignups] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalActiveTribes, setTotalActiveTribes] = useState(0);
  const [me, setMe] = useState(null);
  useEffect(() => {
    async function loadProfile() {
      try {
        const userData = await fetchMe();
        console.log(userData);
        setMe(userData);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);


  // Fetch revenue data on mount
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchRevenue();
        setMonthlyRevenue(data.monthlyRevenue);
        setLastWeekRevenue(data.lastWeekRevenue);
        setLast7Payments(data.last7Payments);
      } catch (error) {
        console.error("Error fetching revenue:", error);
      }
    };

    getData();
  }, []);

  const [lastFourReports, setLastFourReports] = useState([]);

  useEffect(() => {
    const getLastFourReports = async () => {
      try {
        const data = await fetchLastFourReports(); // API you already created
        setLastFourReports(data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    getLastFourReports();
  }, []);

  useEffect(() => {
    const getSignups = async () => {
      try {
        const data = await fetchTotalSignupsLast7Days();
        setNewSignups(data.totalSignupsLast7Days || 0);
      } catch (error) {
        console.error("Error fetching new signups:", error);
      }
    };

    getSignups();
  }, []);

  // Fetch total users
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchTotalUsers();
        setTotalUsers(data.totalUsers || 0);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    getUsers();
  }, []);

  // Fetch total active tribes
  useEffect(() => {
    const getTribes = async () => {
      try {
        const data = await fetchTotalActiveTribes();
        setTotalActiveTribes(data.totalActiveTribes || 0);
      } catch (error) {
        console.error("Error fetching total active tribes:", error);
      }
    };

    getTribes();
  }, []);


  // Prepare chart configuration when monthlyRevenue is available
  useEffect(() => {
    if (monthlyRevenue.length > 0) {
      // Create labels from the month and year values
      const labels = monthlyRevenue.map((item) => {
        const { month, year } = item._id;
        const dateObj = new Date(year, month - 1);
        return dateObj.toLocaleString("default", { month: "short" });
      });

      // Extract revenue values
      const revenues = monthlyRevenue.map((item) => item.revenue);

      // Set up chart data and options
      setChartData({
        labels,
        datasets: [
          {
            label: "Revenue",
            data: revenues,
            fill: false,
            borderColor: "#7763F3",
            backgroundColor: "#7763F3",
            tension: 0.4, // smooth line
            pointRadius: 5,
          },
        ],
      });

      setChartOptions({
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
          title: { display: false, text: "Monthly Revenue" },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Income" },
            ticks: { callback: (val) => Number(val).toFixed(0) },
          },
        },
      });
    }
  }, [monthlyRevenue]);

  const getBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";      // Yellow badge
      case "in review":
        return "info";         // Blue badge
      case "resolved":
        return "success";      // Green badge
      case "cancelled":
        return "danger";       // Red badge
      default:
        return "secondary";    // Gray badge for unknown
    }
  };

  const [showRevenue, setShowRevenue] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);

  useEffect(() => {
    // whenever loading turns false, recalc all four
    if (!loading) {
      setShowRevenue(me.level === "super" || me.level === "finance");
      setShowCommunity(me.level === "super" || me.level === "community");
    }
  }, [loading]);


  return (
    <>
      <Resources />
      <div id="app">
        <div className="main-wrapper main-wrapper-1">
          <div className="navbar-bg"></div>
          <Navbar />
          <Sidebar />
          <div className="main-content">
            <section className="section">
              <div className="row ">
                <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div className="card">
                    <div className="card-statistic-4">
                      <div className="align-items-center justify-content-between">
                        <div className="row ">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                            <div className="card-content">
                              <h5 className="font-15">New Accounts</h5>
                              <h2 className="mb-3 font-18">{newSignups}</h2>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                            <div className="banner-img">
                              <img src="../../../assets/admin_assets/img/banner/1.png" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div className="card">
                    <div className="card-statistic-4">
                      <div className="align-items-center justify-content-between">
                        <div className="row ">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                            <div className="card-content">
                              <h5 className="font-15">Total Users</h5>
                              <h2 className="mb-3 font-18">{totalUsers}</h2>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                            <div className="banner-img">
                              <img src="../../../assets/admin_assets/img/banner/2.png" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div className="card">
                    <div className="card-statistic-4">
                      <div className="align-items-center justify-content-between">
                        <div className="row ">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                            <div className="card-content">
                              <h5 className="font-15">Active Tribes</h5>
                              <h2 className="mb-3 font-18">{totalActiveTribes}</h2>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                            <div className="banner-img">
                              <img src="../../../assets/admin_assets/img/banner/3.png" alt="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {showRevenue && (
                  <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="card">
                      <div className="card-statistic-4">
                        <div className="align-items-center justify-content-between">
                          <div className="row ">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pr-0 pt-3">
                              <div className="card-content">
                                <h5 className="font-15">Revenue</h5>
                                <h2 className="mb-3 font-18">
                                  ${lastWeekRevenue.toLocaleString()}
                                </h2>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 pl-0">
                              <div className="banner-img">
                                <img src="../../../assets/admin_assets/img/banner/4.png" alt="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
              {showRevenue && (
                <div className="row">
                  <div className="col-12 col-sm-12 col-lg-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>Revenue chart</h4>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-lg-9">
                            <div>
                              {chartData.labels && (
                                <Line data={chartData} options={chartOptions} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="row">

                {showCommunity && (
                  <div className="col-md-6 col-lg-12 col-xl-6">
                    <div className="card">
                      <div className="card-header">
                        <h4>Support Ticket</h4>
                      </div>
                      <div className="card-body">
                        {lastFourReports.length > 0 ? (
                          lastFourReports.map((ticket, index) => (
                            <div className="support-ticket media pb-1 mb-3" key={ticket._id || index}>
                              <div className="media-body ml-3">
                                <div className={`badge badge-pill badge-${getBadgeColor(ticket.status)} mb-1 float-right`}>
                                  {ticket.status || "Other"}
                                </div>
                                <span className="font-weight-bold">#{ticket.tickno || "N/A"}</span>
                                <a href="javascript:void(0)">{ticket.type || "No Title"}</a>
                                <p className="my-1">
                                  {ticket.Description
                                    ? ticket.Description.length > 20
                                      ? ticket.Description.slice(0, 20) + "..."
                                      : ticket.Description
                                    : "No Description"}
                                </p>

                                <small className="text-muted">
                                  Created by{" "}
                                  <span className="font-weight-bold font-13">{ticket.user?.username || "Unknown"}</span>
                                  &nbsp;&nbsp; - {formatDate(ticket.createdAt)}
                                </small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No tickets found.</p>
                        )}
                      </div>
                      <a
                        href="/admin/opulententrepreneurs/open/support"
                        className="card-footer card-link text-center small "
                      >
                        View All
                      </a>
                    </div>
                  </div>)}

                {showRevenue && (
                  <div className="col-md-6 col-lg-12 col-xl-6">
                    <div className="card">
                      <div className="card-header">
                        <h4>Payments</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Client Name</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {last7Payments && last7Payments.length > 0 ? (
                                last7Payments.map((payment, index) => (
                                  <tr key={payment._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{payment.user?.username || "N/A"}</td>
                                    <td>{new Date(payment.createdAt).toLocaleDateString() || "N/A"}</td>
                                    <td>{payment.data || "N/A"}</td>
                                    <td>${payment.payment?.toLocaleString() || "N/A"}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center">No recent payments found.</td>
                                </tr>
                              )}
                            </tbody>


                          </table>

                        </div>
                      </div>
                      <a
                        href="/admin/opulententrepreneurs/open/payment"
                        className="card-footer card-link text-center small "
                      >
                        View All
                      </a>
                    </div>
                  </div>)}
              </div>
            </section>

          </div>

        </div>
      </div>
    </>
  );
};

export default AdminBody;