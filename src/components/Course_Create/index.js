"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import axios from "axios";
import { TextEditor } from "./TextEditor";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  fetchCoursesArray, fetchMe
} from "@/app/api"; // Import new API functions
import { useRouter } from "next/navigation";

const CreateCourse = () => {
  const router = useRouter();
  const [me, setMe] = useState(null); // <- new state for current user
  const [loading3, setLoading3] = useState(true); // <- new state for current user
  const [loading2, setLoading2] = useState(true); // <- new state for current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetchMe();
        setMe(response); // assuming response contains user object directly
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading3(false); // <- Move here to ensure it always runs after fetch
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!loading3) {
      if (me && (me.level !== "super" && me.level !== "community")) {
        router.push("/admin/opulententrepreneurs/open/dashboard");
      } else {
        setLoading2(false); // Only allow render when authorized
      }
    }
  }, [me, loading3]);
  const [formData, setFormData] = useState({
    title: "",
    Author: "",
    AuthorLink: "",
    courseCategory: "Tech",
    description: "",
    shortdescription: "",
    courseContent: "",
    price: "",
  });

  const [tools, setTools] = useState([]);

  // Fetch initial categories (tools) on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchCoursesArray();
        // Assuming response.data is an array of tool categories
        setTools(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Thumbnail file and preview URL.
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Dynamic file inputs (up to 5); initialize with one empty entry.
  const [files, setFiles] = useState([null]);

  // Dynamic arrays for links.
  const [externalLinks, setExternalLinks] = useState([""]);
  const [referenceLinks, setReferenceLinks] = useState([""]);
  const [assessmentLinks, setAssessmentLinks] = useState([""]);
  const [videosLinks, setVideoLinks] = useState([""]);

  // Handle basic text input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // When a thumbnail is chosen, update state and generate a preview URL.
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle change for an individual file input.
  const handleIndividualFileChange = (index, e) => {
    const file = e.target.files[0];
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = file;
      return newFiles;
    });
  };

  // Add a new file input (up to 5 total).
  const addFileInput = () => {
    if (files.length < 5) {
      setFiles((prevFiles) => [...prevFiles, null]);
    }
  };

  // Remove a file input.
  const removeFileInput = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handlers for rich text editor fields.
  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleCourseContentChange = (content) => {
    setFormData((prev) => ({ ...prev, courseContent: content }));
  };

  // Dynamic External Links handlers.
  const handleExternalLinkChange = (index, value) => {
    setExternalLinks((prev) => {
      const newLinks = [...prev];
      newLinks[index] = value;
      return newLinks;
    });
  };

  const addExternalLink = () => {
    setExternalLinks((prev) => [...prev, ""]);
  };

  const removeExternalLink = (index) => {
    setExternalLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoLinkChange = (index, value) => {
    setVideoLinks((prev) => {
      const newLinks = [...prev];
      newLinks[index] = value;
      return newLinks;
    });
  };

  const addVideoLink = () => {
    setVideoLinks((prev) => [...prev, ""]);
  };

  const removeVideoLink = (index) => {
    setVideoLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic Reference Links handlers.
  const handleReferenceLinkChange = (index, value) => {
    setReferenceLinks((prev) => {
      const newLinks = [...prev];
      newLinks[index] = value;
      return newLinks;
    });
  };

  const addReferenceLink = () => {
    setReferenceLinks((prev) => [...prev, ""]);
  };

  const removeReferenceLink = (index) => {
    setReferenceLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic Assessment Links handlers.
  const handleAssessmentLinkChange = (index, value) => {
    setAssessmentLinks((prev) => {
      const newLinks = [...prev];
      newLinks[index] = value;
      return newLinks;
    });
  };

  const addAssessmentLink = () => {
    setAssessmentLinks((prev) => [...prev, ""]);
  };

  const removeAssessmentLink = (index) => {
    setAssessmentLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper function to inject inline styles for tables.
  const injectTableBorders = (htmlString) => {
    if (!htmlString) return htmlString;
    const container = document.createElement("div");
    container.innerHTML = htmlString;
    container.querySelectorAll("table").forEach((table) => {
      // Append inline style for the table element.
      const currentStyle = table.getAttribute("style") || "";
      const borderStyle = "border: 1px solid #000; border-collapse: collapse;";
      table.setAttribute("style", currentStyle + borderStyle);
      // Also apply border style to all table header cells and data cells.
      table.querySelectorAll("th, td").forEach((cell) => {
        const cellCurrentStyle = cell.getAttribute("style") || "";
        cell.setAttribute("style", cellCurrentStyle + "border: 1px solid #000;");
      });
    });
    return container.innerHTML;
  };

  // On form submission, pack data into a FormData object.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Inject inline table styles into description and courseContent.
    const updatedDescription = injectTableBorders(formData.description);
    const updatedCourseContent = injectTableBorders(formData.courseContent);

    const data = new FormData();

    // Append basic text fields with the updated HTML content.
    data.append("title", formData.title);
    data.append("Author", formData.Author);
    data.append("AuthorLink", formData.AuthorLink);
    data.append("price", formData.price);
    data.append("courseCategory", formData.courseCategory);
    data.append("shortdescription", formData.shortdescription);
    data.append("description", updatedDescription);
    data.append("courseContent", updatedCourseContent);

    // Append the thumbnail.
    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }

    // Append each file from the dynamic file inputs.
    files.forEach((file) => {
      if (file) {
        data.append("files", file);
      }
    });

    // Append links as JSON strings.
    data.append(
      "externalLinks",
      JSON.stringify(externalLinks.filter((link) => link.trim() !== ""))
    );
    data.append(
      "videosLinks",
      JSON.stringify(videosLinks.filter((link) => link.trim() !== ""))
    );
    data.append(
      "referenceLinks",
      JSON.stringify(referenceLinks.filter((link) => link.trim() !== ""))
    );
    data.append(
      "assessmentLinks",
      JSON.stringify(assessmentLinks.filter((link) => link.trim() !== ""))
    );

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Course created successfully.");
      // Optionally, reset the form or redirect here.
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course.");
    }
  };
  if (loading2) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <Resources />
      <div id="app">
        <div className="main-wrapper main-wrapper-1">
          <div className="navbar-bg"></div>
          <Navbar />
          <Sidebar />
          <div className="main-content">
            <section className="section">
              <div className="section-body">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>Enter Course Details</h4>
                      </div>
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          {/* Title */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Title
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          {/* Author */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Author
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <input
                                type="text"
                                className="form-control"
                                name="Author"
                                value={formData.Author}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Author Link
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <input
                                type="text"
                                className="form-control"
                                name="AuthorLink"
                                value={formData.AuthorLink}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Short Description
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <textarea
                                type="text"
                                className="form-control"
                                name="shortdescription"
                                value={formData.shortdescription}
                                onChange={handleChange}
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Price
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <input
                                type="Number"
                                className="form-control"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>


                          {/* Course Category */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Course Category
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <select
                                className="form-control selectric"
                                name="toolCategory"
                                value={formData.toolCategory}
                                onChange={handleChange}
                              >
                                {tools && tools.length > 0 ? (
                                  tools.map((tool, index) => (
                                    <option key={index} value={tool.category || tool}>
                                      {tool.category || tool}
                                    </option>
                                  ))
                                ) : (
                                  <>
                                    <option value="Tech">Tech</option>
                                    <option value="News">News</option>
                                    <option value="Political">Political</option>
                                  </>
                                )}
                              </select>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Description
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <TextEditor onChange={handleDescriptionChange} />
                            </div>
                          </div>

                          {/* Course Content */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Course Content
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <TextEditor onChange={handleCourseContentChange} />
                            </div>
                          </div>

                          {/* Thumbnail with Preview */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Thumbnail
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <div id="image-preview" className="image-preview">
                                <label htmlFor="image-upload" id="image-label">
                                  Choose File
                                </label>
                                <input
                                  type="file"
                                  name="thumbnail"
                                  id="image-upload"
                                  onChange={handleThumbnailChange}
                                  required
                                />
                                {thumbnailPreview && (
                                  <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail Preview"
                                    style={{ width: "200px", marginTop: "10px" }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Files */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Files (up to 5)
                            </label>
                            <div className="col-sm-12 col-md-7">
                              {files.map((file, index) => (
                                <div key={index} style={{ marginBottom: "10px" }}>
                                  <input
                                    type="file"
                                    onChange={(e) => handleIndividualFileChange(index, e)}
                                  />
                                  {files.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeFileInput(index)}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              {files.length < 5 && (
                                <button type="button" onClick={addFileInput}>
                                  Add File
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Video Links
                            </label>
                            <div className="col-sm-12 col-md-7">
                              {videosLinks.map((link, index) => (
                                <div key={index} style={{ marginBottom: "10px" }}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={link}
                                    onChange={(e) =>
                                      handleVideoLinkChange(index, e.target.value)
                                    }
                                    placeholder="Enter Video link"
                                  />
                                  {videosLinks.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeVideoLink(index)}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button type="button" onClick={addVideoLink}>
                                Add Video Link
                              </button>
                            </div>
                          </div>

                          {/* External Links */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              External Links
                            </label>
                            <div className="col-sm-12 col-md-7">
                              {externalLinks.map((link, index) => (
                                <div key={index} style={{ marginBottom: "10px" }}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={link}
                                    onChange={(e) =>
                                      handleExternalLinkChange(index, e.target.value)
                                    }
                                    placeholder="Enter external link"
                                  />
                                  {externalLinks.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeExternalLink(index)}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button type="button" onClick={addExternalLink}>
                                Add External Link
                              </button>
                            </div>
                          </div>

                          {/* Reference Links */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Reference Links
                            </label>
                            <div className="col-sm-12 col-md-7">
                              {referenceLinks.map((link, index) => (
                                <div key={index} style={{ marginBottom: "10px" }}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={link}
                                    onChange={(e) =>
                                      handleReferenceLinkChange(index, e.target.value)
                                    }
                                    placeholder="Enter reference link"
                                  />
                                  {referenceLinks.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeReferenceLink(index)}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button type="button" onClick={addReferenceLink}>
                                Add Reference Link
                              </button>
                            </div>
                          </div>

                          {/* Assessment Links */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Assessment Links
                            </label>
                            <div className="col-sm-12 col-md-7">
                              {assessmentLinks.map((link, index) => (
                                <div key={index} style={{ marginBottom: "10px" }}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={link}
                                    onChange={(e) =>
                                      handleAssessmentLinkChange(index, e.target.value)
                                    }
                                    placeholder="Enter assessment link"
                                  />
                                  {assessmentLinks.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeAssessmentLink(index)}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button type="button" onClick={addAssessmentLink}>
                                Add Assessment Link
                              </button>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="form-group row mb-4">
                            <div className="col-sm-12 col-md-7 offset-md-3">
                              <button type="submit" className="btn btn-primary">
                                Create Course
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCourse;
