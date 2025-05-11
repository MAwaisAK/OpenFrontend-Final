"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation"; // Next.js 13 hook for route params
import "@/styles/profile-style.css";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchMe,
  createChatLobbyRequest,
} from "@/app/api";

const MyTribes = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [tribesData, setTribesData] = useState([]); // New state for tribe data

  const [activeTab, setActiveTab] = useState("tribes");
    const [friendRequests, setFriendRequests] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sent, setSent] = useState(false);
  const [requests, setRequests] = useState(false);
  const dropdownRef = useRef(null);
    const [authUser, setAuthUser] = useState(null);
    const [tribers, setTribers] = useState(false);
    const [block, setBlock] = useState(false);


    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userData = await fetchMe();
          setAuthUser(userData);
    
          // Check if the user is blocked or has blocked the other user
          if (Array.isArray(userData.blockedtribers) && userData.blockedtribers.includes(id)) {
            setBlock(true);
          } else if (Array.isArray(userData.blockedby) && userData.blockedby.includes(id)) {
            setBlock(true);
          } else {
            setBlock(false);
          }
    
          if (Array.isArray(userData.sentrequests) && userData.sentrequests.includes(id)) {
            setSent(true);
          } else {
            setSent(false);
          }
    
          if (Array.isArray(userData.requests) && userData.requests.includes(id)) {
            setRequests(true);
          } else {
            setRequests(false);
          }
    
          if (Array.isArray(userData.mytribers) && userData.mytribers.includes(id)) {
            setTribers(true);
          } else {
            setTribers(false);
          }
        } catch (error) {
          console.error("Error fetching auth user", error);
        }
      };
      fetchUser();
    }, []);
    

      const handleStartChat = async (userId) => {
        if (!authUser) {
          console.error("User not authenticated");
          return;
        }
        try {
          const { chatLobbyId } = await createChatLobbyRequest(authUser._id, userId);
          window.location.href = `/profile/chat`;
        } catch (error) {
          console.error("Error starting chat", error);
        }
      };

        const handleAcceptRequest = async (requestId) => {
          if (!authUser) {
            console.error("User not authenticated");
            return;
          }
          try {
            await acceptFriendRequest(requestId, authUser._id);
          } catch (error) {
            console.error("Error accepting friend request", error);
          }
        };

          const handleRejectRequest = async (requestId) => {
            if (!authUser) {
              console.error("User not authenticated");
              return;
            }
            try {
              await rejectFriendRequest(requestId, authUser._id);
            } catch (error) {
              console.error("Error rejecting friend request", error);
            }
          };


      // Send friend request.
      const handleFriendRequest = async (userId) => {
        if (!authUser) {
          console.error("User not authenticated");
          return;
        }
        try {
          await sendFriendRequest(userId, authUser._id);
          setSent(true);
        } catch (error) {
          console.error("Error sending friend request:", error);
        }
      };

  // Log the route parameters to verify

  // Fetch the target user profile using Axios from the "/profile/:id" endpoint.
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
           `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/auth/profile/${id}`
        );
        if (response.data.success) {
          setProfileData(response.data.data);

          // Fetch tribe details for each joined tribe
          if (
            response.data.data.joined_tribes &&
            response.data.data.joined_tribes.length > 0
          ) {
            const joinedTribes = response.data.data.joined_tribes;
            setTribesData(joinedTribes);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  useEffect(() => {
  }, [tribesData]); // This will log whenever tribesData is updated

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

  // Use fetched profileData exclusively
  const profile = profileData;

  if (!profile) {
    return <div>Loading...</div>;
  }

  // If the profile's privacy is set to "private", display a message.
  if (profile.privacy && profile.privacy === "private") {
    return (
      <div className="userprofile-container">
        <p>This user profile is private.</p>
      </div>
    );
  }

  if (block) {
    return (
      <>
        {/* your CSS imports stay */}
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
          {/* default banner: no user banner */}
          <header
            className="userprofile-header"
            style={{
              backgroundImage: "none",
              backgroundColor: "#007BFF",  // your solid‐blue fallback
            }}
          />
  
          {/* default avatar only */}
          <div className="userprofile-photo-left" style={{ marginTop: "-50px", textAlign: "center" }}>
            <img
              className="userprofile-photo"
              src="/assets/admin_assets/img/users/user.png"
              alt="Blocked profile"
            />
          </div>
        </div>
      </>
    );
  }

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
       backgroundImage: profile.display_banner
         ? `url(${profile.display_banner})`
         : "none",
       backgroundColor: profile.display_banner ? "transparent" : "#007BFF", // solid blue fallback
     }}
     
    >
      {/* Uncomment and update dropdown if needed */}
    </header>


        <main className="userprofile-main">
          <div className="row">
            {/* Left Section */}
            <div className="userprofile-left col-lg-4">
              <div className="userprofile-photo-left">
                <img
                  className="userprofile-photo"
                  src={
                    profile.profile_pic
                      ? profile.profile_pic
                      : "/assets/admin_assets/img/users/user.png"
                  }
                  alt="Profile"
                />
              </div>
              <h4 className="userprofile-name">
  {`${profile.firstName || profile.username} ${profile.lastName || ""}`}
</h4>

              <p className="userprofile-info">{profile.username || "Owner"}</p>
              <p className="userprofile-info">{profile.email}</p>

              <div className="userprofile-stats row">
                <div className="userprofile-stat col-xs-4">
                  <p className="userprofile-number-stat">
                    {profile.totalMytribers}
                  </p>
                  <p className="userprofile-desc-stat">Tribers</p>
                </div>
                <div className="userprofile-stat col-xs-4">
                  <p className="userprofile-number-stat">
                    {profile.totalTribes}
                  </p>
                  <p className="userprofile-desc-stat">Joined Tribes</p>
                </div>
              </div>

              <p className="userprofile-desc">
                {profile.bio || "Not Provided"}
              </p>

              <div className="userprofile-social">
                {profile.facebook_link && (
                  <a href={profile.facebook_link} target="_blank" rel="noopener noreferrer">
                    <i
                      className="fa-brands fa-facebook-f"
                      aria-hidden="true"
                      style={{ color: "#3b5998" }}
                    />
                  </a>
                )}
                {profile.instagram_link && (
                  <a href={profile.instagram_link} target="_blank" rel="noopener noreferrer">
                    <i
                      className="fa-brands fa-instagram"
                      aria-hidden="true"
                      style={{ color: "red" }}
                    />
                  </a>
                )}
                {profile.linkedin_link && (
                  <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer">
                    <i
                      className="fa-brands fa-linkedin"
                      aria-hidden="true"
                      style={{ color: "darkblue" }}
                    />
                  </a>
                )}
                {profile.x_link && (
                  <a href={profile.x_link} target="_blank" rel="noopener noreferrer">
                    <i
                      className="fa-brands fa-x-twitter"
                      aria-hidden="true"
                      style={{ color: "black" }}
                    />
                  </a>
                )}
                {profile.web_link && (
                  <a href={profile.web_link} target="_blank" rel="noopener noreferrer">
                    <i
                      className="fa-solid fa-globe"
                      aria-hidden="true"
                      style={{ color: "black" }}
                    />
                  </a>
                )}
              </div>
              <div className="tribe d-flex flex-column align-items-center">
  {/* 1) No request yet → show “Add Triber” */}
  {!tribers && !sent && !requests && (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handleFriendRequest(id);
      }}
    >
      <span className="userprofile-follow-mobile mb-2">
        Add Triber
      </span>
    </a>
  )}

  {/* 2) Request already sent → show disabled “Request Sent” */}
  {!tribers && sent && (
    <span className="userprofile-follow-mobile mb-2 disabled">
      Request Sent
    </span>
  )}

  {/* 3) Incoming request → show “Accept” */}
  {!tribers && requests && (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handleAcceptRequest(id);
      }}
    >
      <span className="userprofile-follow-mobile mb-2">
        Accept
      </span>
    </a>
  )}

  {/* 4) Message (always shown, no mb-2) */}
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      handleStartChat(id);
    }}
  >
    <span className="userprofile-follow-mobile">
      Message
    </span>
  </a>
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
                    {/* Tribe Title and Category */}
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
                  {/* About Info */}
                  {(() => {
                    const hasBusinessInfo =
                      profile.primary_business ||
                      (profile.business_country && profile.business_country.length > 0) ||
                      (profile.business_industry && profile.business_industry.length > 0) ||
                      (profile.value_chainstake && profile.value_chainstake.length > 0) ||
                      (profile.markets_covered && profile.markets_covered.length > 0) ||
                      (profile.immediate_needs && profile.immediate_needs.length > 0) ||
                      (tribesData.length > 0);

                    if (!hasBusinessInfo) {
                      return <h3>Profile set to private</h3>;
                    }

                    return (
                      <>
                        <p>
                          <strong>Primary Business:</strong>{" "}
                          {profile.primary_business || "Not Provided"}
                        </p>
                        <p>
                          <strong>Business Country:</strong>{" "}
                          {profile.business_country && profile.business_country.length > 0
                            ? profile.business_country.join(", ")
                            : "Not Provided"}
                        </p>
                        <p>
                          <strong>Business Industry:</strong>{" "}
                          {profile.business_industry && profile.business_industry.length > 0
                            ? profile.business_industry.join(", ")
                            : "Not Provided"}
                        </p>
                        <p>
                          <strong>Value Chain Stake:</strong>{" "}
                          {profile.value_chainstake && profile.value_chainstake.length > 0
                            ? profile.value_chainstake.join(", ")
                            : "Not Provided"}
                        </p>
                        <p>
                          <strong>Markets Covered:</strong>{" "}
                          {profile.markets_covered && profile.markets_covered.length > 0
                            ? profile.markets_covered.join(", ")
                            : "Not Provided"}
                        </p>
                        <p>
                          <strong>Immediate Needs:</strong>{" "}
                          {profile.immediate_needs && profile.immediate_needs.length > 0
                            ? profile.immediate_needs.join(", ")
                            : "Not Provided"}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
<div className="d-flex">
  {/* 1) No request yet → show “Add Triber” */}
  {!tribers && !sent && !requests && (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handleFriendRequest(id);
      }}
    >
      <span className="userprofile-follow">Add Triber</span>
    </a>
  )}

  {/* 2) Request already sent → show disabled “Request Sent” */}
  {!tribers && sent && (
    <span className="userprofile-follow disabled">
      Request Sent
    </span>
  )}

  {/* 3) Incoming request → show “Accept” */}
  {!tribers && requests && (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        handleAcceptRequest(id);
      }}
    >
      <span className="userprofile-follow">Accept</span>
    </a>
  )}

  {/* 4) Message always rendered; only remove mt-5 when tribers */}
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      handleStartChat(id);
    }}
  >
    <span className={tribers ? "userprofile-follow" : "userprofile-follow mt-5"}>
      Message
    </span>
  </a>
</div>




            </div>
           
          </div>
        </main>
      </div>
    </>
  );
};

export default MyTribes;