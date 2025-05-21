"use client";
import React, { useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
import Sidebar from "../AdminSideBar";
import Navbar from "../Nav";
import axios from "axios";
import { saveAs } from "file-saver";
import {fetchAllCoursesbyId,fetchMe } from "@/app/api";  // Import only needed functions}

const AdminBody = () => {
  const { id } = useParams(); // Course ID from URL
  const [course, setCourse] = useState(null);
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const data = await fetchAllCoursesbyId(id); // Use the API function to get the course data
          setCourse(data);

          // Fetch user data to check if the course is in the user's courses
          const userData = await fetchMe(); // Assuming fetchMe gets the current user info
          if (!userData.courses.includes(id)) {
            // If the user does not have the course, redirect them to the profile page
            router.push("/profile");
          }
        } catch (error) {
          console.error("Error fetching course details:", error);
        }
      };

      fetchCourse(); // Call the function
    }
  }, [id, router]); // Dependency array with router for redirection


  const BASE_ENDPOINT =
  process.env.NEXT_PUBLIC_BASE_ENDPOINT;

  // Download handler using FileSaver
  const handleDownload = async (fileUrl, fileName) => {
    try {
      const finalUrl = fileUrl.includes("firebasestorage.googleapis.com")
        ? `${BASE_ENDPOINT}/proxy-download?fileUrl=${encodeURIComponent(fileUrl)}`
        : fileUrl;
        
      const response = await fetch(finalUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  

  if (!course) return <div>Loading...</div>;

  return (
    <>
      {/*<Navbar />*/}
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            {/* Top Row: Thumbnail, Title & Basic Info */}
            <div className="row">
              <div className="col-md-5 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <ul className="course-image d-flex">
                      <li>
                        <div>
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="img-fluid"
                          />
                        </div>
                      </li>
                    </ul>
                    <ul className="course-image">
                      <li>
                        <div>
                          <h3>{course.title}</h3>
                        </div>
                      </li>
                    </ul>
                    <div className="course-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td><b>Author</b></td>
                            <td>{course.Author}</td>
                          </tr>
                          <tr>
                            <td><b>Category</b></td>
                            <td>{course.courseCategory}</td>
                          </tr>
                          {course.files && course.files.length > 0 && (
                            <tr>
                              <td><b>Material</b></td>
                              <td>
                                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                                  {course.files.map((fileUrl, index) => (
                                    <li
                                      key={index}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                        marginBottom: "5px",
                                        cursor: "pointer"
                                      }}
                                    >
                                      <span
                                        onClick={() => handleDownload(fileUrl, `File ${index + 1}`)}
                                        style={{
                                          textDecoration: "none",
                                          color: "inherit",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "5px"
                                        }}
                                      >
                                        <span>File {index + 1}</span>
                                        <i
                                          className="mdi mdi-download"
                                          style={{ fontSize: "1.2rem" }}
                                        ></i>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td><b>Assessment Link</b></td>
                            <td>
                              {course.assessmentLinks && course.assessmentLinks.length > 0 ? (
                                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                                  {course.assessmentLinks.map((link, index) => (
                                    <li key={index}>
                                      <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: "none" }}
                                      >
                                        {link}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                "N/A"
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Description Section */}
              <div className="col-md-7 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <p className="card-title mb-0">Description</p>
                    <div className="m-2" dangerouslySetInnerHTML={{ __html: course.description }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Content Section */}
            <div className="row">
              <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <p className="card-title mb-0">Content</p>
                    {course.courseContent ? (
                      <div className="m-2" dangerouslySetInnerHTML={{ __html: course.courseContent }} />
                    ) : (
                      <p className="m-2">No content available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Video Section */}
            {course.videosLinks && course.videosLinks.length > 0 && (
              <div className="row justify-content-center">
                <div className="col-md-9 grid-margin stretch-card">
                  <div className="card bg-dark">
                    <div className="card-body">
                      <div style={{ width: "100%", position: "relative", paddingTop: "49.12%" }}>
                        <iframe
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: "none",
                          }}
                          src={course.videosLinks[0].replace(/^["']|["']$/g, "")}
                          frameBorder="0"
                          allowFullScreen
                          scrolling="no"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* External and Reference Links */}
            <div className="row">
              <div className="col-md-6 grid-margin stretch-card justify-item-center">
                <div className="card">
                  <div className="card-body">
                    <p className="card-title mb-0">External Links</p>
                    {course.externalLinks && course.externalLinks.length > 0 ? (
                      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {course.externalLinks.map((link, index) => (
                          <li key={index}>
                            <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>N/A</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 grid-margin stretch-card justify-item-center">
                <div className="card">
                  <div className="card-body">
                    <p className="card-title mb-0">Reference Links</p>
                    {course.referenceLinks && course.referenceLinks.length > 0 ? (
                      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {course.referenceLinks.map((link, index) => (
                          <li key={index}>
                            <a href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>N/A</p>
                    )}
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
