"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import axios from "axios";
import { TextEditor } from "./TextEditor";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const EditCourse = () => {
  const router = useRouter();
  const { id } = useParams();

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

  // Thumbnail file and preview URL.
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState(null);

  // Dynamic file inputs (up to 5)
  const [files, setFiles] = useState([null]);

  // Dynamic arrays for links.
  const [externalLinks, setExternalLinks] = useState([""]);
  const [referenceLinks, setReferenceLinks] = useState([""]);
  const [assessmentLinks, setAssessmentLinks] = useState([""]);
  const [videosLinks, setVideoLinks] = useState([""]);

  // Fetch course details when component mounts.
  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/${id}`)
        .then((response) => {
          const course = response.data;
          setFormData({
            title: course.title || "",
            Author: course.Author || "",
            AuthorLink: course.AuthorLink || "",
            courseCategory: course.courseCategory || "Tech",
            description: course.description || "",
            shortdescription: course.shortdescription || "",
            courseContent: course.courseContent || "",
            price: course.price || "",
          });
          if (course.thumbnail) {
            setExistingThumbnail(course.thumbnail);
            setThumbnailPreview(course.thumbnail);
          }
          setExternalLinks(
            course.externalLinks && course.externalLinks.length
              ? course.externalLinks
              : [""]
          );
          setVideoLinks(
            course.videosLinks && course.videosLinks.length
              ? course.videosLinks
              : [""]
          );
          setReferenceLinks(
            course.referenceLinks && course.referenceLinks.length
              ? course.referenceLinks
              : [""]
          );
          setAssessmentLinks(
            course.assessmentLinks && course.assessmentLinks.length
              ? course.assessmentLinks
              : [""]
          );
        })
        .catch((err) => {
          console.error("Error fetching course details:", err);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleIndividualFileChange = (index, e) => {
    const file = e.target.files[0];
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles[index] = file;
      return newFiles;
    });
  };

  const addFileInput = () => {
    if (files.length < 5) {
      setFiles((prevFiles) => [...prevFiles, null]);
    }
  };

  const removeFileInput = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  const handleCourseContentChange = (content) => {
    setFormData((prev) => ({ ...prev, courseContent: content }));
  };

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

  const injectTableBorders = (htmlString) => {
    if (!htmlString) return htmlString;
    const container = document.createElement("div");
    container.innerHTML = htmlString;
    container.querySelectorAll("table").forEach((table) => {
      const currentStyle = table.getAttribute("style") || "";
      const borderStyle = "border: 1px solid #000; border-collapse: collapse;";
      table.setAttribute("style", currentStyle + borderStyle);
      table.querySelectorAll("th, td").forEach((cell) => {
        const cellCurrentStyle = cell.getAttribute("style") || "";
        cell.setAttribute("style", cellCurrentStyle + "border: 1px solid #000;");
      });
    });
    return container.innerHTML;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDescription = injectTableBorders(formData.description);
    const updatedCourseContent = injectTableBorders(formData.courseContent);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("Author", formData.Author);
    data.append("AuthorLink", formData.AuthorLink);
    data.append("price", formData.price);
    data.append("courseCategory", formData.courseCategory);
    data.append("shortdescription", formData.shortdescription);
    data.append("description", updatedDescription);
    data.append("courseContent", updatedCourseContent);

    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }

    files.forEach((file) => {
      if (file) {
        data.append("files", file);
      }
    });

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
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/course/edit/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Course updated successfully.");
      router.push("/admin/opulententrepreneurs/open/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course.");
    }
  };

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
                        <h4>Edit Course</h4>
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

                          {/* Author Link */}
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

                          {/* Short Description */}
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

                          {/* Price */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Price
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <input
                                type="number"
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
                                name="courseCategory"
                                value={formData.courseCategory}
                                onChange={handleChange}
                              >
                                <option value="Tech">Tech</option>
                                <option value="News">News</option>
                                <option value="Political">Political</option>
                              </select>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Description
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <TextEditor
                                onChange={handleDescriptionChange}
                                initialValue={formData.description}
                              />
                            </div>
                          </div>

                          {/* Course Content */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Course Content
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <TextEditor
                                onChange={handleCourseContentChange}
                                initialValue={formData.courseContent}
                              />
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
                                  {existingThumbnail ? "Change File" : "Choose File"}
                                </label>
                                <input
                                  type="file"
                                  name="thumbnail"
                                  id="image-upload"
                                  onChange={handleThumbnailChange}
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

                          {/* Video Links */}
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
                                    onChange={(e) => handleVideoLinkChange(index, e.target.value)}
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
                                    onChange={(e) => handleExternalLinkChange(index, e.target.value)}
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
                                    onChange={(e) => handleReferenceLinkChange(index, e.target.value)}
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
                                    onChange={(e) => handleAssessmentLinkChange(index, e.target.value)}
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
                                Update Course
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

export default EditCourse;
