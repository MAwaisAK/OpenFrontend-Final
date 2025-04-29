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

  {/* Right Controls - Hidden on Mobile */}
 
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

  <div className="offcanvas-body">
    {/* Search Section */}
    <div className="mb-3">
      <input type="text" className="form-control" placeholder="Search profiles..." />
    </div>

    {/* Sort Dropdown */}
 
  </div>
</div>

       <div className="container">
        <div className="profile-card minimal">
            <div className="card-header">
                <div className="profile-img">
                    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">User1</h3>
                <p className="title">User Title</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>
                <div className="d-flex justify-content-between align-items-center my-1 fs-5 ">
              <div className="d-flex align-items-center">
                <i className="fas fa-users me-3"></i>
                <span>35</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-user-friends me-3"></i>
                <span>35</span>
              </div>
            </div>

    {/* Created Section */}



                <div className="social-links mt-3">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
                <button className="connect-btn">Add to Triber</button>
            </div>
        </div>
        <div className="profile-card minimal">
            <div className="card-header">
                <div className="profile-img">
                    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">User1</h3>
                <p className="title">User Title</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>
                <div className="d-flex justify-content-between align-items-center my-1 fs-5 ">
              <div className="d-flex align-items-center">
                <i className="fas fa-users me-3"></i>
                <span>35</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-user-friends me-3"></i>
                <span>35</span>
              </div>
            </div>

    {/* Created Section */}



                <div className="social-links mt-3">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
                <button className="connect-btn">Add to Triber</button>
            </div>
        </div>
        <div className="profile-card minimal">
            <div className="card-header">
                <div className="profile-img">
                    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">User1</h3>
                <p className="title">User Title</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>
                <div className="d-flex justify-content-between align-items-center my-1 fs-5 ">
              <div className="d-flex align-items-center">
                <i className="fas fa-users me-3"></i>
                <span>35</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-user-friends me-3"></i>
                <span>35</span>
              </div>
            </div>

    {/* Created Section */}



                <div className="social-links mt-3">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
                <button className="connect-btn">Add to Triber</button>
            </div>
        </div>
        <div className="profile-card minimal">
            <div className="card-header">
                <div className="profile-img">
                    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">User1</h3>
                <p className="title">User Title</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>
                <div className="d-flex justify-content-between align-items-center my-1 fs-5 ">
              <div className="d-flex align-items-center">
                <i className="fas fa-users me-3"></i>
                <span>35</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-user-friends me-3"></i>
                <span>35</span>
              </div>
            </div>

    {/* Created Section */}



                <div className="social-links mt-3">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
                <button className="connect-btn">Add to Triber</button>
            </div>
        </div>
        <div className="profile-card minimal">
            <div className="card-header">
                <div className="profile-img">
                    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">User1</h3>
                <p className="title">User Title</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>
                <div className="d-flex justify-content-between align-items-center my-1 fs-5 ">
              <div className="d-flex align-items-center">
                <i className="fas fa-users me-3"></i>
                <span>35</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-user-friends me-3"></i>
                <span>35</span>
              </div>
            </div>

    {/* Created Section */}



                <div className="social-links mt-3">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
                <button className="connect-btn">Add to Triber</button>
            </div>
        </div>
        <div className="profile-card minimal">
            <div className="card-header">
                <div className="profile-img">
                    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">User1</h3>
                <p className="title">User Title</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>
                <div className="d-flex justify-content-between align-items-center my-1 fs-5 ">
              <div className="d-flex align-items-center">
                <i className="fas fa-users me-3"></i>
                <span>35</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-user-friends me-3"></i>
                <span>35</span>
              </div>
            </div>

    {/* Created Section */}



                <div className="social-links mt-3">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
                <button className="connect-btn">Add to Triber</button>
            </div>
        </div>
        <div className="profile-card minimal">
            <div className="card-header">
                <div className="profile-img">
                    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">User1</h3>
                <p className="title">User Title</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>
                <div className="d-flex justify-content-between align-items-center my-1 fs-5 ">
              <div className="d-flex align-items-center">
                <i className="fas fa-users me-3"></i>
                <span>35</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-user-friends me-3"></i>
                <span>35</span>
              </div>
            </div>

    {/* Created Section */}



                <div className="social-links mt-3">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
                <button className="connect-btn">Add to Triber</button>
            </div>
        </div>
        <div className="profile-card minimal">
            <div className="card-header">
                <div className="profile-img">
                    <img src="https://randomuser.me/api/portraits/women/75.jpg" alt="Profile Image"/>
                </div>
            </div>
            <div className="card-body">
                <h3 className="name">User1</h3>
                <p className="title">User Title</p>
                <p className="bio">Passionate about creating beautiful and intuitive user experiences.</p>
                <div className="d-flex justify-content-between align-items-center my-1 fs-5 ">
              <div className="d-flex align-items-center">
                <i className="fas fa-users me-3"></i>
                <span>35</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-user-friends me-3"></i>
                <span>35</span>
              </div>
            </div>

    {/* Created Section */}



                <div className="social-links mt-3">
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-github"></i></a>
                </div>
                <button className="connect-btn">Add to Triber</button>
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