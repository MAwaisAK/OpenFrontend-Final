"use client";
import React, { useState, useEffect } from "react";
import "@/styles/profilecard.css";
import { fetchCoursesByIds, fetchMe } from "@/app/api"; // Ensure fetchCoursesByIds is exported properly
import Link from "next/link";
import { useRouter } from "next/navigation";

const MyTribes = () => {
  const [courses, setCourses] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [userCourses, setUserCourses] = useState([]);
  const coursesPerPage = 9;
  const router = useRouter();

  useEffect(() => {
    const getCoursesAndUser = async () => {
      try {
        // Fetch user data
        const userData = await fetchMe();
        // Set user's courses (assume it's an array of course IDs)
        const userCourseIds = userData?.courses || [];
        setUserCourses(userCourseIds);

        // Fetch only the courses for the user using the course IDs array
        if (userCourseIds.length > 0) {
          const courseData = await fetchCoursesByIds(userCourseIds);
          // If courseData is not an array, try to use courseData.courses
          const courseArray = Array.isArray(courseData)
            ? courseData
            : courseData.courses || [];
          setCourses(courseArray);
        } else {
          // If no courses, set courses to empty array
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getCoursesAndUser();
  }, []);

  // Helper to sort courses based on the sortBy option.
  const getSortedCourses = () => {
    const sorted = [...courses].sort((a, b) => {
      if (sortBy === "recent") {
        // Assuming courses have a createdAt property.
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "top rated") {
        // Assuming courses have a rating property.
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === "category") {
        return (a.courseCategory || "").localeCompare(b.courseCategory || "");
      }
      return 0;
    });
    return sorted;
  };

  const sortedCourses = getSortedCourses();

  // Compute unique course categories.
  const uniqueCategories = Array.from(
    new Set(courses.map(course => course.courseCategory).filter(Boolean))
  );

  // Filter courses by search term and selected category.
  const filteredCourses = sortedCourses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.shortdescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.courseCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations.
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="content-nav mb-4 d-flex justify-content-between align-items-center gap-3">
        {/* Left Button (Empty for now) */}
        <div></div>

        {/* Right Controls - Hidden on Mobile */}
        <div className="d-none d-md-flex align-items-center gap-2">
          <div className="d-flex align-items-center">
            {searchVisible && (
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search courses..."
                style={{ width: "200px", transition: "all 0.3s" }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            )}
            <button
              className="btn btn-link text-dark"
              onClick={() => setSearchVisible(!searchVisible)}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="sortDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </button>
            <ul className="dropdown-menu" aria-labelledby="sortDropdown">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => { setSortBy("recent"); setCurrentPage(1); }}
                >
                  Recent
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => { setSortBy("top rated"); setCurrentPage(1); }}
                >
                  Top Rated
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => { setSortBy("category"); setCurrentPage(1); }}
                >
                  Category
                </button>
              </li>
            </ul>
          </div>

          {/* Separate Category Filter Dropdown */}
          <div className="dropdown ms-2">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="categoryDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Category: {selectedCategory === "all" ? "All" : selectedCategory}
            </button>
            <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
              <li>
                <button className="dropdown-item" onClick={() => { setSelectedCategory("all"); setCurrentPage(1); }}>
                  All
                </button>
              </li>
              {uniqueCategories.map((cat, i) => (
                <li key={i}>
                  <button className="dropdown-item" onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile View - Hamburger Menu */}
        <button
          className="btn btn-link d-md-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
          aria-controls="mobileSidebar"
        >
          <i className="fas fa-bars fa-lg"></i>
        </button>
      </div>

      {/* Offcanvas Sidebar for Mobile */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 id="mobileSidebarLabel">Filters</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Sort by</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            >
              <option value="recent">Recent</option>
              <option value="top rated">Top Rated</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Filter by Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All</option>
              {uniqueCategories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="container p-4">
        <div className="row">
          {currentCourses.map((course) => (
            <div key={course._id} className="col-md-4 mb-4">
              <div className="profile-card-tool minimal">
                <div className="card-header">
                  <div className="profile-img">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="img-fluid"
                    />
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="name">{course.title}</h3>
                  <p className="title">{course.courseCategory}</p>
                  <p className="title">
                    <b>Author:</b> {course.Author}
                  </p>
                  <p className="bio">{course.shortdescription}</p>
                  {userCourses.includes(course._id) ? (
                    <Link href={`/profile/courses/${course._id}`}>
                      <button className="connect-btn btn-outline-success">View Course</button>
                    </Link>
                  ) : (
                    <Link href={`/profile/checkout?price=${course.price}&package=course&id=${course._id}`}>
                      <button className="connect-btn">Buy ${course.price}</button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="custom-pagination d-flex justify-content-center align-items-center my-4">
        <button
          type="button"
          className="btn btn-primary btn-pagination me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <span>&laquo; Back</span>
        </button>
        <div className="btn-group" role="group" aria-label="Page navigation">
          {pageNumbers.map((number) => (
            <button
              key={number}
              type="button"
              className={`btn btn-primary btn-pagination ${currentPage === number ? "active" : ""}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary btn-pagination ms-2"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <span>Next &raquo;</span>
        </button>
      </div>
    </>
  );
};

export default MyTribes;
