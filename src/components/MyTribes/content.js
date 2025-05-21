"use client";
import { useState, useEffect , useRef} from 'react';
import { fetchUsersAllTribes } from "@/app/api";
import { useAuth } from "../../lib/AuthContext"; 
import "@/styles/profilecard.css";
import axios from "axios"; // Import axios
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // ensure bootstrap JS is loaded

const MyTribes = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState('recent'); // Options: recent, top rated, category
  const [selectedCategory, setSelectedCategory] = useState("all"); // For category filtering
  const [tribes, setTribes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tribesPerPage = 9;
  const router = useRouter();
  const { user } = useAuth();
  const userId = user._id;
  const successToastRef = useRef(null);
const errorToastRef = useRef(null);

const showToast = (ref) => {
const toast = new bootstrap.Toast(ref.current);
toast.show();
};


  useEffect(() => {
    const getTribes = async () => {
      try {
        const data = await fetchUsersAllTribes();
  
        // Filter out blocked tribes or tribes with false status
        const filteredTribes = data.filter(tribe => {
          // Check if the tribe is not blocked by the user and if it has a true status
          const isNotBlocked = !user.blockedByTribe?.includes(tribe.id);
          const hasActiveStatus = tribe.status !== false;
  
          return isNotBlocked && hasActiveStatus;
        });
  
        // Map filtered data to include createdAt and calculate average ratings.
        const mappedTribes = filteredTribes.map(tribe => {
          const averageRating =
            tribe.ratings?.length
              ? tribe.ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0) / tribe.ratings.length
              : 0;
  
          return {
            id: tribe.id,
            title: tribe.title,
            admins: tribe.admins,
            shortDescription: tribe.shortDescription,
            longDescription: tribe.longDescription,
            status: tribe.status,
            thumbnail: tribe.thumbnail,
            banner: tribe.banner,
            tribeCategory: tribe.tribeCategory,
            rating: averageRating, // Use the calculated average rating here
            totalMembers: tribe.totalMembers,
            createdAt: tribe.createdAt,
          };
        });
  
        setTribes(mappedTribes);
      } catch (error) {
        console.error("Error fetching tribes:", error);
      }
    };
    getTribes();
  }, [user]); // Adding 'user' as dependency to re-fetch when the user data changes
  
  

  const handleJoinTribe = async (tribeId) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/join-tribe`, 
        { tribeId, userId }
      );
  
      if (response.data) {
        successToastRef.current.querySelector(".toast-body").innerText = "Successfully joined the tribe!";
showToast(successToastRef);


  
        // Update UI: increase member count
        setTribes((prevTribes) =>
          prevTribes.map((tribe) =>
            tribe.id === tribeId ? { ...tribe, totalMembers: tribe.totalMembers + 1 } : tribe
          )
        );
  
        // Manually update user.joined_tribes (locally)
        user.joined_tribes = [...(user.joined_tribes || []), tribeId];
  
        // Now router push to tribe chat page (optional)
        router.push(`/profile/tribe-chat/${tribeId}`);
      }
    } catch (error) {
      successToastRef.current.querySelector(".toast-body").innerText = "Failed to join the tribe.";
showToast(errorToastRef);
    }
  };
  

  // Helper to sort tribes based on sortBy option.
  const getSortedTribes = () => {
    const sorted = [...tribes].sort((a, b) => {
      if (sortBy === "recent") {
        // Newest first: compare createdAt dates
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "top rated") {
        // Highest rating first
        return b.rating - a.rating;
      } else if (sortBy === "category") {
        // Alphabetical by tribeCategory
        return (a.tribeCategory || "").localeCompare(b.tribeCategory || "");
      }
      return 0;
    });
    return sorted;
  };

  const sortedTribes = getSortedTribes();

  // Compute unique categories from tribes.
  const uniqueCategories = Array.from(
    new Set(tribes.map(tribe => tribe.tribeCategory).filter(Boolean))
  );

  // Filter tribes by selected category and search query.
  const filteredTribes = sortedTribes.filter(tribe => {
    const matchesCategory = selectedCategory === "all" || tribe.tribeCategory === selectedCategory;
    const matchesSearch =
      tribe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tribe.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination calculations.
  const indexOfLastTribe = currentPage * tribesPerPage;
  const indexOfFirstTribe = indexOfLastTribe - tribesPerPage;
  const currentTribes = filteredTribes.slice(indexOfFirstTribe, indexOfLastTribe);
  const totalPages = Math.ceil(filteredTribes.length / tribesPerPage);

  // Calculate placeholders to pad the row to a multiple of 3.
  const remainder = currentTribes.length % 3;
  const placeholders = remainder ? Array(3 - remainder).fill(null) : [];

  // Pagination event handlers.
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="content-nav mb-4 d-flex justify-content-between align-items-center gap-3">
      <div>
    <Link href="/profile/user-tribes" className="btn btn-primary">
      My Tribes
    </Link>
  </div>

        {/* Right Controls - Hidden on Mobile */}
        <div className="d-none d-md-flex align-items-center gap-2">
          <div className="d-flex align-items-center">
            {searchVisible && (
              <input
                type="text"
                className="form-control search-input"
                placeholder="Search profiles..."
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
                <button className="dropdown-item" onClick={() => { setSortBy("recent"); setCurrentPage(1); }}>
                  Recent
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => { setSortBy("top rated"); setCurrentPage(1); }}>
                  Top Rated
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => { setSortBy("category"); setCurrentPage(1); }}>
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
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Sort by</label>
            <select className="form-select" onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
              <option value="recent">Recent</option>
              <option value="top rated">Top Rated</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Filter by Category</label>
            <select className="form-select" onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}>
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
          {currentTribes.map((tribe, index) => (
           <div className="col-12 col-md-4 d-flex justify-content-center" key={index}>
  <div className="profile-card minimal mb-4" style={{ maxWidth: "360px", width: "100%" }}>

                {/* Card header with banner as background image */}
                <div
                  className="card-header"
                  style={{
                    backgroundImage: `url(${tribe.banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="profile-img">
                    <img src={tribe.thumbnail} alt="Profile Image" />
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="name">{tribe.title}</h3>
                  <p className="title">{tribe.tribeCategory}</p>
                  <p className="bio">{tribe.shortDescription}</p>
                  <div className="d-flex justify-content-between align-items-center my-1 fs-5">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-users me-3"></i>
                      <span>{tribe.totalMembers}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-star me-3"></i>
                      <span>{tribe.rating.toFixed(1)}</span>

                    </div>
                  </div>
                  {/* CreatedAt Section */}
                  <div className="text-center mb-3">
                    <small className="text-muted">
                      Created: {new Date(tribe.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <button
  className="connect-btn"
  onClick={async () => {
    if (user && user.joined_tribes?.map(String).includes(String(tribe.id))) {
      router.push(`/profile/tribe-chat/${tribe.id}`);
    } else {
      await handleJoinTribe(tribe.id);
      // No need to manually setTribes here again
    }
  }}
>
  {user && user.joined_tribes?.map(String).includes(String(tribe.id))
    ? "To Chat"
    : "Join"}
</button>

<button
  className="connect-btn"
  onClick={() => {
      // Navigate to tribe details page
      router.push(`/profile/tribes/${tribe.id}`);
    
  }}
>
  Details
</button>


                </div>
              </div>
            </div>
          ))}
          {/* Placeholders to pad the row */}
          {placeholders.map((_, index) => (
            <div className="col-md-4" key={`placeholder-${index}`} style={{ visibility: 'hidden' }}>
              <div className="profile-card minimal"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="custom-pagination">
        <button type="button" className="btn btn-primary btn-pagination" onClick={handlePrevPage}>
          <span>&laquo; Back</span>
        </button>
        <div className="btn-group" role="group" aria-label="Basic example">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`btn btn-primary btn-pagination ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-primary btn-pagination" onClick={handleNextPage}>
          <span>Next &raquo;</span>
        </button>
      </div>
      <div
ref={successToastRef}
className="toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-4"
role="alert"
aria-live="assertive"
aria-atomic="true"
>
<div className="d-flex">
<div className="toast-body">Action succeeded.</div>
<button
type="button"
className="btn-close btn-close-white me-2 m-auto"
data-bs-dismiss="toast"
aria-label="Close"
></button>
</div>
</div>

{/* Error Toast */}
<div
ref={errorToastRef}
className="toast align-items-center text-white bg-danger border-0 position-fixed bottom-0 end-0 m-4"
role="alert"
aria-live="assertive"
aria-atomic="true"
>
<div className="d-flex">
<div className="toast-body">Action failed.</div>
<button
type="button"
className="btn-close btn-close-white me-2 m-auto"
data-bs-dismiss="toast"
aria-label="Close"
></button>
</div>
</div>
    </>
  );
};

export default MyTribes;
