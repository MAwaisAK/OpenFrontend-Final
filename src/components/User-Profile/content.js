"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../lib/AuthContext"; // Import the useAuth hook
import {getTribesByIds} from "@/app/api";
import "@/styles/profile-style.css";
import Link from "next/link";

const MyTribes = () => {
  const { user } = useAuth(); // Get user info from auth context
  const [activeTab, setActiveTab] = useState("tribes");
  const [showDropdown, setShowDropdown] = useState(false);
  const [tribesData, setTribesData] = useState([]); // Initialize tribesData as an empty array
  const dropdownRef = useRef(null);


  useEffect(() => {
    const fetchTribesData = async () => {
      try {
        if (user?.joined_tribes?.length > 0) {
          const tribeIds = user.joined_tribes.map(tribe => tribe._id || tribe); // Support both full objects and ID strings
          const fullTribesData = await getTribesByIds(tribeIds); // Fetch full tribe data from backend
          setTribesData(fullTribesData); // Set the fetched data into stat
        }
      } catch (error) {
        console.error("Error fetching tribe details:", error);
      }
    };
  
    fetchTribesData();
  }, [user]);
  

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    useEffect(() => {
    }, [tribesData]); // This will log whenever tribesData is updated

  return (
    <>
      <link
        rel="stylesheet prefetch"
        href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet prefetch"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />
      <link
        rel="stylesheet prefetch"
        href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600"
      />

      <div className="userprofile-container">
        <header
          className="userprofile-header"
          style={{
            backgroundImage: user.display_banner
              ? `url(${user.display_banner})`
              : "none",
            backgroundColor: user.display_banner ? "transparent" : "#007BFF", // solid blue fallback
            backgroundSize: "cover",        // <-- scale to cover 100%
            backgroundRepeat: "no-repeat",  // <-- don’t tile
            backgroundPosition: "center",   // <-- center the image
          }}
        >
          {/* 
          <div className="dropdown" ref={dropdownRef}>
            <i
              className="fa-solid fa-ellipsis-h"
              aria-hidden="true"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <ul className="dropdown-menu show" style={{ left: "-150px" }}>
                <li onClick={() => alert("Profile clicked")}>Profile</li>
                <li onClick={() => alert("Settings clicked")}>Settings</li>
                <li onClick={() => alert("Logout clicked")}>Logout</li>
              </ul>
            )}
          </div>*/}
        </header>

        <main className="userprofile-main">
          <div className="row">
            {/* Left Section */}
            <div className="userprofile-left col-lg-4">
              <div className="userprofile-photo-left">
                <img
                  className="userprofile-photo"
                  src={
                    user && user.profile_pic
                      ? user.profile_pic
                      : "/assets/admin_assets/img/users/user.png"
                  }
                  alt="Profile"
                />
              </div>
              <h4 className="userprofile-name">
                {user ? `${user.firstName || user.username} ${user.lastName || ""}` : "Jane Doe"}
              </h4>
              <p className="userprofile-info">
                {user ? user.username : "Owner"}
              </p>
              <p className="userprofile-info">
                {user ? user.email : "jane.doe@gmail.com"}
              </p>

              <div className="userprofile-stats row">
                <div className="userprofile-stat col-xs-4">
                  <p className="userprofile-number-stat">
                    {user && user.mytribers ? user.mytribers.length : "0"}
                  </p>
                  <p className="userprofile-desc-stat">Tribers</p>
                </div>
                <div className="userprofile-stat col-xs-4">
                  <p className="userprofile-number-stat">
                    {user && user.joined_tribes ? user.joined_tribes.length : "0"}
                  </p>
                  <p className="userprofile-desc-stat">Joined Tribes</p>
                </div>
              </div>

              <p className="userprofile-desc">
                {user ? user.bio : "Hi! My name is Jane Doe. I'm from Paris, in France. I really enjoy photography and mountains."}
              </p>

              <div className="userprofile-social">
  {user && user.facebook_link && (
    <a href={user.facebook_link} target="_blank" rel="noopener noreferrer">
      <i
        className="fa-brands fa-facebook-f"
        aria-hidden="true"
        style={{ color: "#3b5998" }} // Facebook blue
      />
    </a>
  )}
  {user && user.instagram_link && (
    <a href={user.instagram_link} target="_blank" rel="noopener noreferrer">
      <i
        className="fa-brands fa-instagram"
        aria-hidden="true"
        style={{ color: "red" }} // Instagram red
      />
    </a>
  )}
  {user && user.linkedin_link && (
    <a href={user.linkedin_link} target="_blank" rel="noopener noreferrer">
      <i
        className="fa-brands fa-linkedin"
        aria-hidden="true"
        style={{ color: "darkblue" }} // LinkedIn dark blue
      />
    </a>
  )}
  {user && user.x_link && (
    <a href={user.x_link} target="_blank" rel="noopener noreferrer">
      <i
        className="fa-brands fa-x-twitter"
        aria-hidden="true"
        style={{ color: "black" }} // X black
      />
    </a>
  )}
  {user && user.web_link && (
    <a href={user.web_link} target="_blank" rel="noopener noreferrer">
      <i
        className="fa-solid fa-globe"
        aria-hidden="true"
        style={{ color: "black" }} // Web black
      />
    </a>
  )}
</div>


              <div className="tribe d-flex justify-content-center">
                <span className="userprofile-follow-mobile">Add to Tribers</span>
              </div>
            </div>

            {/* Right Section */}
            <div className="userprofile-right col-lg-8">
              {/* Navigation */}
              <ul className="userprofile-nav">
                <li
                  className={activeTab === "tribes" ? "active" : ""}
                  onClick={() => setActiveTab("tribes")}
                >
                  Joined Tribes
                </li>
                <li
                  className={activeTab === "about" ? "active" : ""}
                  onClick={() => setActiveTab("about")}
                >
                  About
                </li>
              </ul>

              {/* Conditional Content */}
              {/* Conditional Content */}
{activeTab === "tribes" ? (
 <ul className="tribe-list">
 {tribesData.length > 0 ? (
   tribesData.map((tribe, index) => (
     <li key={index} className="tribe-item">
       {/* Tribe Thumbnail */}
       <div className="tribe-thumbnail">
         <img
           src={tribe.thumbnail || "https://via.placeholder.com/150"} // Default placeholder image if thumbnail is missing
           alt={`Thumbnail for ${tribe.title}`}
           className="tribe-thumbnail-img"
         />
       </div>

       <Link href={`/profile/tribes/${tribe._id}`}>
       <div className="tribe-info">
         <strong className="tribe-title">{tribe.title}</strong>
         <p className="tribe-category">{tribe.tribeCategory}</p>
       </div>
       </Link>
     </li>
   ))
 ) : (
   <li>No tribes joined yet.</li>
 )}
</ul>
) : (
  <div className="about-info">
    <p>
      <strong>First Name:</strong> {user ? user.firstName : "Jane"}
    </p>
    <p>
      <strong>Last Name:</strong> {user ? user.lastName : "Doe"}
    </p>
    <p>
      <strong>Description:</strong>{" "}
      {user ? user.bio : "Passionate about photography and exploring new places."}
    </p>
    <p>
      <strong>Phone:</strong>{" "}
      {user && user.phone ? user.phone.join(", ") : "+1 234 567 890"}
    </p>
    <p>
      <strong>Primary Business:</strong>{" "}
      {user && user.primary_business ? user.primary_business : "Not Provided"}
    </p>
    <p>
      <strong>Business Country:</strong>{" "}
      {user && user.business_country && user.business_country.length > 0
        ? user.business_country.join(", ")
        : "Not Provided"}
    </p>
    <p>
      <strong>Business Industry:</strong>{" "}
      {user && user.business_industry && user.business_industry.length > 0
        ? user.business_industry.join(", ")
        : "Not Provided"}
    </p>
    <p>
      <strong>Value Chain Stake:</strong>{" "}
      {user && user.value_chainstake && user.value_chainstake.length > 0
        ? user.value_chainstake.join(", ")
        : "Not Provided"}
    </p>
    <p>
      <strong>Markets Covered:</strong>{" "}
      {user && user.markets_covered && user.markets_covered.length > 0
        ? user.markets_covered.join(", ")
        : "Not Provided"}
    </p>
    <p>
      <strong>Immediate Needs:</strong>{" "}
      {user && user.immediate_needs && user.immediate_needs.length > 0
        ? user.immediate_needs.join(", ")
        : "Not Provided"}
    </p>
  </div>
)}

            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MyTribes;
