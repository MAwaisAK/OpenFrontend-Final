"use client";
import React,{useState,useEffect} from "react";
import Sidebar from "../AdminSideBar";
import NewsSection from "../NewsSection";
import Navbar from "../Nav";
import Slider from "react-slick";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import this at the top
import axios from "axios";
// Import slick-carousel CSS files
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { fetchRandomTribers , fetchMe , fetchTopTribes,
  fetchTotalTools,
  fetchTotalCourses,
  fetchRandomTools,
  fetchRandomCourses,} from "@/app/api";
import { useAuth } from "@/lib/AuthContext"; // Adjust path as needed

const AdminBody = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardImage, setDashboardImage] = useState(null);
  const [fellowTribers, setFellowTribers] = useState([]);
  const [totalMyTribes, setTotalMyTribes] = useState(0);
  const [topTribes, setTopTribes] = useState([]);
  const [totalTools, setTotalTools] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [randomTools, setRandomTools] = useState([]);
  const [randomCourses, setRandomCourses] = useState([]);
  const [lifttokens, setLifttokens] = useState(0);

  useEffect(() => {
    async function fetchImages() {
      try {
        const resDashboard = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/images/get-dashboard`);
        setDashboardImage(resDashboard.data.dashboardimg);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }
    fetchImages();
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const tribers = await fetchRandomTribers();
        console.log(tribers.randomTribers);
        setFellowTribers(tribers.randomTribers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const [
          topTribesData,
          totalToolsData,
          randomToolsData,
          randomCoursesData,
        ] = await Promise.all([
          fetchTopTribes(),
          fetchTotalTools(),
          fetchRandomTools(),
          fetchRandomCourses(),
        ]);
        console.log(totalToolsData);
        setTopTribes(topTribesData?.topTribes || []);
        setTotalTools(totalToolsData.totalTools || 0);
        setRandomTools(randomToolsData.randomTools || []);
        setRandomCourses(randomCoursesData.randomCourses|| []);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    }
  
    fetchDashboardStats();
  }, []);
  

  useEffect(() => {
  async function fetchInitialData() {
    try {
      const [tribersData, userData] = await Promise.all([
        fetchRandomTribers(),
        fetchMe(),
      ]);

      // Set random tribers
      setFellowTribers(tribersData.randomTribers);

      // Get joined and blocked tribe IDs
      const joined = userData?.joined_tribes || [];
      const blocked = userData?.blockedbytribe || [];

      // Convert blocked tribe IDs to string for comparison
      const blockedIds = new Set(blocked.map((tribe) => tribe.toString()));

      // Filter out blocked tribes from joined tribes
      const unblockedTribes = joined.filter(
        (tribe) => !blockedIds.has(tribe.toString())
      );

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchInitialData();
}, []);

useEffect(() => {
  async function fetchUserTribes() {
    try {
      const userData = await fetchMe();
      const joinedTribes = userData?.joined_tribes || [];
      const blockedTribes = new Set(
        userData?.blockedbytribe?.map((id) => id.toString()) || []
      );

      // Filter out blocked tribes from joinedTribes
      const validTribes = joinedTribes.filter(
        (tribe) => !blockedTribes.has(tribe._id?.toString())
      );

      console.log("Total joined tribes (excluding blocked):", validTribes.length);
      setTotalMyTribes(validTribes.length);
      setLifttokens(userData?.tokens || 0);
    } catch (error) {
      console.error("Error fetching user tribes:", error);
    }
  }

  async function fetchUserCourses() {
    try {
      const userData = await fetchMe();
      const courses = userData?.courses || [];
      console.log("Total courses:", courses.length);
      setTotalCourses(courses.length);
    } catch (error) {
      console.error("Error fetching user courses:", error);
    }
  }

  fetchUserTribes();
  fetchUserCourses();
}, []);




  const fellowSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Two slides per view on mobile
    slidesToScroll: 1,
    autoplay: false,
  };

  // Helper to check if description is long enough to warrant a "Show More" button
  const isLongDescription = (desc) => desc && desc.length > 100;

  return (
    <>
      <Navbar/>
      <div className="container-fluid page-body-wrapper">
        <Sidebar/>
        <div className="main-panel">
          <div className="content-wrapper">
            {/* Header and Alerts */}
            <div className="col-md-12 grid-margin">
  <div className="row">
    <div className="col-12 col-xl-8 mb-4 mb-xl-0">
      <h3 className="font-weight-bold">Welcome {user?.username}</h3>

      {/* Subscription Level */}
      <p className="mb-2">
        <strong>Subscription:</strong>{" "}
        <span className="badge bg-info text-dark text-capitalize">
          {user.subscription}
        </span>
      </p>

      {user?.subscription === "none" && (
        <div className="d-flex gap-2 flex-wrap">
          <a
            href="/profile/checkout?package=basic"
            className="btn btn-outline-primary btn-sm"
          >
            Upgrade to Basic
          </a>
          <a
            href="/profile/checkout?package=premium"
            className="btn btn-outline-success btn-sm"
          >
            Upgrade to Premium
          </a>
          {!user?.trial_used && (
            <a
              href="/profile/checkout?package=trial"
              className="btn btn-outline-warning btn-sm"
            >
              7 Day Free Trial
            </a>
          )}
        </div>
      )}

      {user?.subscription === "trial" && (
        <div className="d-flex gap-2 flex-wrap">
          <a
            href="/profile/checkout?package=basic"
            className="btn btn-outline-primary btn-sm"
          >
            Upgrade to Basic
          </a>
          <a
            href="/profile/checkout?package=premium"
            className="btn btn-outline-success btn-sm"
          >
            Upgrade to Premium
          </a>
        </div>
      )}

      {user?.subscription === "basic" && (
        <div className="d-flex gap-2 flex-wrap">
          <a
            href="/profile/checkout?package=premium"
            className="btn btn-outline-success btn-sm"
          >
            Upgrade to Premium
          </a>
        </div>
      )}

      {/* No upgrade options for Premium */}
    </div>
  </div>
</div>


            {/* Dashboard Cards */}
            <div className="row">
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card tale-bg">
                <div
  className="card-people mt-auto"
  style={{
    backgroundImage: `url(${dashboardImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100%",
    borderRadius: "10px" // Adjust the value as needed for rounding the corners
  }}
>
  {/* Optionally add content here */}
</div>


                </div>
              </div>
              <div className="col-md-6 grid-margin transparent">
                <div className="row">
                  <div className="col-md-6 mb-4 stretch-card transparent">
                    <div className="card card-tale">
                      <div className="card-body">
                      <a href="/profile/user-tribes" style={{ all: "unset", cursor: "pointer" }}>
                        <p className="mb-4">MyTribes</p>
                        <p className="fs-30 mb-2">{totalMyTribes}</p>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4 stretch-card transparent">
                   
                    <div className="card card-dark-blue">
                      <div className="card-body">
                      <a href="/profile/user-courses" style={{ all: "unset", cursor: "pointer" }}>
                        <p className="mb-4">Courses</p>
                        <p className="fs-30 mb-2">{totalCourses}</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-4 mb-lg-0 stretch-card transparent">
                    <div className="card card-light-blue">
                      <div className="card-body">
                      <a href="/profile/tools" style={{ all: "unset", cursor: "pointer" }}>
                        <p className="mb-4">Tools</p>
                        <p className="fs-30 mb-2">{totalTools}</p>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 stretch-card transparent">
                    <div className="card card-light-danger">
                      <div className="card-body">
                      <a href="/profile/buy-tokens" style={{ all: "unset", cursor: "pointer" }}>
                        <p className="mb-4">Life-Ai Tokens</p>
                        <p className="fs-30 mb-2">{lifttokens}</p>
                        <p>Buy More</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Top Tribes Table */}
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <NewsSection/>
    </div>
  </div>

</div>
           
            {/* News Carousel */}
          
   
    <div className="row">
    <div className="col-md-7 grid-margin stretch-card">
  <div className="card">
    <div className="card-body">
      <h4 className="card-title">Top Tribes</h4>
      <div className="table-responsive">
        <table className="table table-striped">
          <tbody>
            {topTribes.length > 0 ? (
              topTribes.map((tribe, index) => (
                <tr key={tribe._id || index}>
                  <td className="py-1">
                    <img
                      src={tribe.thumbnail || "/assets/adminassets/images/faces/face1.jpg"}
                      alt={tribe.name}
                      style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "50%" }}
                    />
                  </td>
                  <td>{tribe.title}</td>
                  <td>{tribe.memberCount} members</td>
                  <td>{tribe.tribeCategory || "General"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No top tribes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

      <div className="col-md-5 grid-margin stretch-card d-none d-md-block">
  <div className="card">
    <div className="card-body">
      <p className="card-title">Fellow Tribers</p>
      <ul className="icon-data-list">
        {fellowTribers.map((member, index) => (
          <li key={index}>
            <Link href={`/profile/tribers/${member._id}`} className="text-decoration-none text-reset">
              <div className="d-flex">
                <img
                  src={member.profile_pic || "/assets/admin_assets/img/users/user.png"}
                  alt={member.fullName}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <div style={{ marginLeft: "10px" }}>
                  <p className="text-info mb-1">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="mb-0">{member.aboutme || "No bio available"}</p>
                  <small>@{member.username}</small>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="text-center mt-3">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => router.push("/profile/tribers")}
      >
        View More
      </button>
    </div>
    </div>
    
  </div>
</div>

{/* Mobile View: Horizontal Carousel */}
<div className="col-md-5 grid-margin stretch-card d-block d-md-none">
  <div className="card">
    <div className="card-body">
      <p className="card-title">Fellow Tribers</p>
      <Slider {...fellowSettings}>
        {fellowTribers.map((member, index) => (
          <div key={index} style={{ padding: "10px", textAlign: "center" }}>
            <Link href={`/profile/tribers/${member._id}`} className="text-decoration-none text-reset">
              <img
                src={member.profile_pic || "/assets/admin_assets/img/users/user.png"}
                alt={member.fullName}
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  margin: "0 auto"
                }}
              />
              <div style={{ marginLeft: "10px", textAlign: "center" }}>
                <p className="text-info mb-1">{member.fullName}</p>
                <p className="mb-0">{member.aboutme || "No bio available"}</p>
                <small>@{member.username}</small>
              </div>
            </Link>
          </div>
        ))}
      </Slider>

      {/* View More Button */}
      <div className="text-center mt-3">
      <button
        className="btn btn-outline-primary btn-sm"
        onClick={() => router.push("/profile/tribers")}
      >
        View More
      </button>
      </div>
    </div>
  </div>
</div>
    </div>
    <div className="row">
  {/* COURSES */}
  <div className="col-md-4 stretch-card grid-margin">
    <div className="card">
      <div className="card-body">
        <p className="card-title mb-0">Courses</p>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th className="ps-0 pb-2 border-bottom">Title</th>
                <th className="border-bottom pb-2">Category</th>
                <th className="border-bottom pb-2">Thumbnail</th>
              </tr>
            </thead>
            <tbody>
              {randomCourses?.map(course => (
                <tr key={course._id}>
                  <td className="ps-0">{course.title}</td>
                  <td>{course.courseCategory}</td>
                  <td>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 text-end">
  <a href="/profile/courses" className="btn btn-sm btn-outline-primary">
    View All
  </a>
</div>

        </div>
        
      </div>
    </div>
  </div>

  {/* TOOLS */}
  <div className="col-md-4 stretch-card grid-margin">
    <div className="card">
      <div className="card-body">
        <p className="card-title mb-0">Tools</p>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th className="ps-0 pb-2 border-bottom">Title</th>
                <th className="border-bottom pb-2">Category</th>
                <th className="border-bottom pb-2">Thumbnail</th>
              </tr>
            </thead>
            <tbody>
              {randomTools?.map(tool => (
                <tr key={tool._id}>
                  <td className="ps-0">{tool.title}</td>
                  <td>{tool.toolCategory}</td>
                  <td>
                    <img
                      src={tool.thumbnail}
                      alt={tool.title}
                      style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 text-end">
  <a href="/profile/tools" className="btn btn-sm btn-outline-primary">
    View All
  </a>
</div>

        </div>
      </div>
    </div>
  </div>

  {/* MEETINGS SECTION */}
  <div className="col-md-4 stretch-card grid-margin">
    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card data-icon-card-primary">
        <a href="/profile/lift-ai" style={{ all: "unset", cursor: "pointer" }}>
          <div className="card-body">
            <p className="card-title text-white">Lift Ai</p>
            <div className="row">
              <div className="col-8 text-white">
                <h3>{lifttokens}</h3>
                <p className="text-white font-weight-500 mb-0">
                Try out Lift AI—your smart business assistant. Get strategic guidance, real-time insights, and auto-generated docs to make fast, informed decisions.
                </p>
              </div>
              <div className="col-4 background-icon"></div>
            </div>
          </div>
          </a>
        </div>
      </div>
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card data-icon-card-primary">
        <a href="/profile/user-tribes" style={{ all: "unset", cursor: "pointer" }}>
          <div className="card-body">
            <p className="card-title text-white">My Tribes</p>
            <div className="row">
              <div className="col-8 text-white">
                <h3>{totalMyTribes}</h3>
                <p className="text-white font-weight-500 mb-0">
            Check out for something new in your tribes. <i className="mdi mdi-arrow-right text-white" />
          </p>
        </div>
        <div className="col-4 d-flex align-items-center justify-content-center">
            <i className="mdi mdi-account-multiple text-white" style={{ fontSize: "50px" }} />
          </div>
            </div>
          </div>
          </a>
        </div>
      </div>
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card data-icon-card-primary">
        <a href="/profile/mytribers" style={{ all: "unset", cursor: "pointer" }}>
          <div className="card-body">
            <p className="card-title text-white">My Tribers</p>
            <div className="row">
              <div className="col-8 text-white">
                <p className="text-white font-weight-500 mb-0">
                Check Out Your Tribers for Any Details <i className="mdi mdi-arrow-right text-white" />
                </p>
              </div>
              <div className="col-4 d-flex align-items-center justify-content-center">
          <i className="ti-user icon-lg text-white" />
        </div>
            </div>
          </div>
          </a>
        </div>
      </div>
     
    </div>
  </div>
</div>

  </div>
</div>

      </div>
      </>
  );
};

export default AdminBody;