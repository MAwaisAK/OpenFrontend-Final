"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Script from "next/script";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import { useRouter } from "next/navigation";
import { fetchAllCourses, fetchMe } from "@/app/api";
import '../../styles/admin_assets/bundles/datatables/datatables.min.css';
import '../../styles/admin_assets/bundles/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css';

const Course = () => {
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
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Fetch course data when the component mounts
  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchAllCourses();
        setCourse(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getCourses();
  }, []);

  // Initialize DataTables once data is loaded
  useEffect(() => {
    if (!loading && typeof window !== "undefined" && window.$ && window.$.fn && window.$.fn.DataTable) {
      if (window.$.fn.DataTable.isDataTable('#table-1')) {
        window.$('#table-1').DataTable().destroy();
      }
      window.$('#table-1').DataTable();
    }
  }, [course]);

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
  const handleDelete = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/${courseId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Course deleted successfully.");
      setCourse((prevCourses) => prevCourses.filter((c) => c._id !== courseId));
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course.");
    }
  };

  // Handler for multi deletion
  const handleMultiDelete = async () => {
    if (selectedCourses.length === 0) {
      alert("No courses selected.");
      return;
    }
    if (!confirm("Are you sure you want to delete the selected courses?")) return;
    try {
      await Promise.all(
        selectedCourses.map((courseId) =>
          axios.delete(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/${courseId}`, { headers: { "Content-Type": "application/json" } })
        )
      );
      alert("Selected courses deleted successfully.");
      setCourse((prevCourses) => prevCourses.filter((c) => !selectedCourses.includes(c._id)));
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error deleting courses:", error);
      alert("Error deleting courses.");
    }
  };

  // Handler for multi price update
  const handleUpdatePrice = async () => {
    if (selectedCourses.length === 0) {
      alert("No courses selected.");
      return;
    }
    const newPrice = prompt("Enter new price for selected courses:");
    if (newPrice === null || newPrice.trim() === "") return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/update-price`,
        { courseIds: selectedCourses, newPrice },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Courses updated successfully.");
      setCourse((prevCourses) =>
        prevCourses.map((c) =>
          selectedCourses.includes(c._id) ? { ...c, price: newPrice } : c
        )
      );
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error updating courses price:", error);
      alert("Error updating courses price.");
    }
  };

  // Handler for individual status toggle update
  const handleToggleStatus = async (courseId, checked) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/update-status`,
        { courseIds: [courseId], newStatus: checked },
        { headers: { "Content-Type": "application/json" } }
      );
      setCourse((prevCourses) =>
        prevCourses.map((c) =>
          c._id === courseId ? { ...c, status: checked } : c
        )
      );
    } catch (error) {
      console.error("Error updating course status:", error);
      alert("Error updating course status.");
    }
  };

  // Handler for bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedCourses.length === 0) {
      alert("No courses selected.");
      return;
    }
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/update-status`,
        { courseIds: selectedCourses, newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Courses status updated successfully.");
      setCourse((prevCourses) =>
        prevCourses.map((c) =>
          selectedCourses.includes(c._id) ? { ...c, status: newStatus } : c
        )
      );
      setSelectedCourses([]);
    } catch (error) {
      console.error("Error updating course status:", error);
      alert("Error updating course status.");
    }
  };

  // Handler for individual checkbox selection
  const handleCheckboxChange = (courseId, checked) => {
    if (checked) {
      setSelectedCourses((prev) => [...prev, courseId]);
    } else {
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
    }
  };

  // Handler for "select all" checkbox
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = course.map((c) => c._id);
      setSelectedCourses(allIds);
    } else {
      setSelectedCourses([]);
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
                    <button className="btn btn-info" onClick={handleUpdatePrice}>
                      Update Price for Selected
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
                        <h4>Courses</h4>
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
                                    checked={selectedCourses.length === course.length && course.length > 0}
                                  />
                                </th>
                                <th className="text-center">Id</th>
                                <th>Title</th>
                                <th style={truncateStyle}>Author</th>
                                <th>Thumbnail</th>
                                <th style={truncateStyle}>Course Category</th>
                                <th style={truncateStyle}>Short Description</th>
                                <th style={truncateStyle}>Price</th>
                                <th style={truncateStyle}>Sold</th>
                                <th>Date Added</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {course.map((c, index) => (
                                <tr key={c._id || index}>
                                  <td className="text-center" style={checkboxStyle}>
                                    <input
                                      type="checkbox"
                                      checked={selectedCourses.includes(c._id)}
                                      onChange={(e) =>
                                        handleCheckboxChange(c._id, e.target.checked)
                                      }
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>{c.title}</td>
                                  <td style={truncateStyle}>{c.Author}</td>
                                  <td>
                                    <img
                                      alt="course thumbnail"
                                      src={c.thumbnail}
                                      width={50}
                                      height={50}
                                      style={{ borderRadius: "100%" }}
                                    />
                                  </td>
                                  <td style={truncateStyle}>{c.courseCategory}</td>
                                  <td style={truncateStyle}>{c.shortdescription}</td>
                                  <td style={truncateStyle}>{c.price}</td>
                                  <td style={truncateStyle}>{c.bought}</td>
                                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                                  <td>
                                    {/* Status toggle switch */}
                                    <input
                                      type="checkbox"
                                      checked={c.status === true || c.status === "Active"}
                                      onChange={(e) => handleToggleStatus(c._id, e.target.checked)}
                                    />
                                  </td>
                                  <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <a
                                      href={`/admin/opulententrepreneurs/open/courses/edit/${c._id}`}
                                      className="btn btn-warning"
                                    >
                                      Edit
                                    </a>
                                    <a
                                      onClick={() => handleDelete(c._id)}
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

export default Course;
