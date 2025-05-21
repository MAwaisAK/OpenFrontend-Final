"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../AdminSideBar";
import Navbar from "../Nav";
import { saveAs } from "file-saver";
import {fetchAllToolsCoursesbyId } from "@/app/api";  // Import only needed functions}

const AdminBody = () => {
  const { id } = useParams(); // Course ID from URL
  const [tool, setTool] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const data = await fetchAllToolsCoursesbyId(id); // Use the API function
          setTool(data);
        } catch (error) {
          console.error("Error fetching tool details:", error);
        }
      };

      fetchCourse(); // Call the function
    }
  }, [id]); // Dependency array

  if (!tool) return <div>Loading...</div>;

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
                            src={tool.thumbnail}
                            alt={tool.title}
                            className="img-fluid"
                          />  
                        </div>
                      </li>
                    </ul>
                    <ul className="course-image">
                      <li>
                        <div>
                          <h3>{tool.title}</h3>
                        </div>
                      </li>
                    </ul>
                    <div className="course-responsive">
  <table className="table">
    <tbody>
      <tr>
        <td><b>Category</b></td>
        <td>{tool.courseCategory}</td>
      </tr>
      <tr>
        <td><b>Price</b></td>
        <td>
          {tool.price_heading && tool.price_heading.length > 0 && (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {tool.price_heading.map((heading, index) => (
                <li key={index} style={{ display: "flex", gap: "10px" }}>
                  <b>{heading}:</b> {tool.price[index] || "N/A"}
                </li>
              ))}
            </ul>
          )}
        </td>
      </tr>
      {tool.files && tool.files.length > 0 && (
        <tr>
          <td><b>Material</b></td>
          <td>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {tool.files.map((fileUrl, index) => (
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
                    <i className="mdi mdi-download" style={{ fontSize: "1.2rem" }}></i>
                  </span>
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
      <tr>
        <td><b>Tool Link</b></td>
        <td>
          {tool.externalLink ? (
            <a
              href={tool.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              {tool.externalLink}
            </a>
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
                    <div className="m-2" dangerouslySetInnerHTML={{ __html: tool.description }} />
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
                    {tool.content ? (
                      <div className="m-2" dangerouslySetInnerHTML={{ __html: tool.content }} />
                    ) : (
                      <p className="m-2">No content available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Video Section */}
            {tool.videosLinks && tool.videosLinks.length > 0 && (
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
                          src={tool.videosLinks[0].replace(/^["']|["']$/g, "")}
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
          </div>
        </div>
      </div>
    </>
  
  );
};

export default AdminBody;
