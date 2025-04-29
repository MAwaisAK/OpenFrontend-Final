"use client";
import { useState } from 'react';
import "@/styles/profilecard.css";

const MyTribes = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  return (
    <>
   <div className="content-nav mb-4 d-flex justify-content-between align-items-center gap-3">
  {/* Left Button */}
  <div></div>

  {/* Right Controls - Hidden on Mobile */}
  <div className="d-none d-md-flex align-items-center gap-2">
    {/* Search Section */}
    <div className="d-flex align-items-center">
      {searchVisible && (
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search profiles..."
          style={{ width: "200px", transition: "all 0.3s" }}
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
          <button className="dropdown-item" onClick={() => setSortBy("recent")}>
            Recent
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => setSortBy("top rated")}
          >
            Top Rated
          </button>
        </li>
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
    {/* Search Section */}
    <div className="mb-3">
      <input type="text" className="form-control" placeholder="Search profiles..." />
    </div>

    {/* Sort Dropdown */}
    <div className="mb-3">
      <label className="form-label">Sort by</label>
      <select className="form-select" onChange={(e) => setSortBy(e.target.value)}>
        <option value="recent">Recent</option>
        <option value="top rated">Top Rated</option>
      </select>
    </div>
  </div>
</div>


        <div className="container p-4">
             
        <div className="profile-card-tool minimal">
        <div className="card-header">
                <div className="profile-img">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSehIzC1tVk7K9NVrUnFev3A_QG3dZqxXtPfw&s" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">Sarah Johnson</h3>
                <p className="title">UI/UX Designer</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>

                <button className="connect-btn">Connect</button>
            </div>
        </div>

        <div className="profile-card-tool minimal">
        <div className="card-header">
                <div className="profile-img">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSehIzC1tVk7K9NVrUnFev3A_QG3dZqxXtPfw&s" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">Sarah Johnson</h3>
                <p className="title">UI/UX Designer</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>

                <button className="connect-btn">Connect</button>
            </div>
        </div>

        <div className="profile-card-tool minimal">
        <div className="card-header">
                <div className="profile-img">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSehIzC1tVk7K9NVrUnFev3A_QG3dZqxXtPfw&s" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">Sarah Johnson</h3>
                <p className="title">UI/UX Designer</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>

                <button className="connect-btn">Connect</button>
            </div>
        </div>

        <div className="profile-card-tool minimal">
        <div className="card-header">
                <div className="profile-img">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSehIzC1tVk7K9NVrUnFev3A_QG3dZqxXtPfw&s" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">Sarah Johnson</h3>
                <p className="title">UI/UX Designer</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>

                <button className="connect-btn">Connect</button>
            </div>
        </div>

        </div>
    <div className="custom-pagination">
        <button type="button" className="btn btn-primary btn-pagination">
          <span>&laquo; Back</span>
        </button>
        <div className="btn-group" role="group" aria-label="Basic example">
          <button type="button" className="btn btn-primary btn-pagination">1</button>
          <button type="button" className="btn btn-primary btn-pagination">2</button>
          <button type="button" className="btn btn-primary btn-pagination">3</button>
        </div>
        <button type="button" className="btn btn-primary btn-pagination">
          <span>Next &raquo;</span>
        </button>
      </div>
      </>
  );
};

export default MyTribes;