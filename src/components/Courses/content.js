"use client";

import React, { useState, useEffect } from "react";
import "@/styles/profilecard.css";
import { fetchAllUserCourses, fetchMe } from "@/app/api";
import Link from "next/link";

const MyTribes = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [userCourses, setUserCourses] = useState([]);
  const coursesPerPage = 9;

  useEffect(() => {
    const getCoursesAndUser = async () => {
      try {
        const [me, allCourses] = await Promise.all([
          fetchMe(),
          fetchAllUserCourses(),
        ]);
        setUser(me);
        setUserCourses(me?.courses || []);
        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getCoursesAndUser();
  }, []);

  const getSortedCourses = () =>
    [...courses].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "top rated") {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === "category") {
        return (a.courseCategory || "").localeCompare(b.courseCategory || "");
      }
      return 0;
    });

  const sortedCourses = getSortedCourses();

  const uniqueCategories = Array.from(
    new Set(courses.map((c) => c.courseCategory).filter(Boolean))
  );

  const filteredCourses = sortedCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.shortdescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.courseCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Safely coerce basePrice to a number, then compute original/discounted strings
  const getPrices = (basePrice) => {
    const priceNum = Number(basePrice) || 0;
    let original = priceNum;
    let discounted = priceNum;
    const sub = user?.subscription;

    if (sub === "premium") {
      discounted = 0;
    } else if (sub === "basic") {
      discounted = priceNum * 0.2; // 80% off
    }

    return {
      original: original.toFixed(2),
      discounted: discounted.toFixed(2),
      isDiscounted: discounted < original,
    };
  };

  return (
    <>
      {/* ——— Top Controls ——— */}
      <div className="content-nav mb-4 d-flex justify-content-between align-items-center gap-3">
        <div></div>
        <div className="d-none d-md-flex align-items-center gap-2">
          {/* Search toggle */}
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
              onClick={() => setSearchVisible((v) => !v)}
            >
              <i className="fas fa-search" />
            </button>
          </div>

          {/* Sort */}
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
              {["recent", "top rated", "category"].map((opt) => (
                <li key={opt}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setSortBy(opt);
                      setCurrentPage(1);
                    }}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Category */}
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
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedCategory("all");
                    setCurrentPage(1);
                  }}
                >
                  All
                </button>
              </li>
              {uniqueCategories.map((cat) => (
                <li key={cat}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile menu */}
        <button
          className="btn btn-link d-md-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
          aria-controls="mobileSidebar"
        >
          <i className="fas fa-bars fa-lg" />
        </button>
      </div>

      {/* ——— Mobile Filters Offcanvas ——— */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 id="mobileSidebarLabel">Filters</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          />
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
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
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
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ——— Course Grid ——— */}
      <div className="container p-4">
        <div className="row">
          {currentCourses.map((course) => {
            const enrolled = userCourses.includes(course._id);
            const { original, discounted, isDiscounted } = getPrices(
              course.price
            );

            return (
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

                    {enrolled ? (
                      <Link href={`/profile/courses/${course._id}`}>
                        <button className="connect-btn btn-outline-success">
                          View Course
                        </button>
                      </Link>
                    ) : (
                      <Link
                        href={`/profile/checkout?price=${discounted}&package=course&id=${course._id}`}
                      >
                        <button className="connect-btn">
                          {isDiscounted && (
                            <span className="me-2 text-decoration-line-through">
                              ${original}
                            </span>
                          )}
                          {discounted === "0.00" ? "Free" : `$${discounted}`}
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ——— Pagination ——— */}
      <div className="custom-pagination d-flex justify-content-center align-items-center my-4">
        <button
          type="button"
          className="btn btn-primary btn-pagination me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          &laquo; Back
        </button>
        <div className="btn-group" role="group">
          {pageNumbers.map((number) => (
            <button
              key={number}
              type="button"
              className={`btn btn-primary btn-pagination ${
                currentPage === number ? "active" : ""
              }`}
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
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next &raquo;
        </button>
      </div>
    </>
  );
};

export default MyTribes;
