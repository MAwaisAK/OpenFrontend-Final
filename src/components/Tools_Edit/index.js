"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import { TextEditor } from "./TextEditor";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const EditTool = () => {
  const router = useRouter();
  const { id } = useParams(); // the tool ID from URL
  const [formData, setFormData] = useState({
    title: "",
    toolCategory: "Tech",
    description: "",
    content: "",
    externalLink: "",
    shortdescription: ""
  });
  
  // Thumbnail file and its preview URL.
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState(null);

  // Dynamic heading & detail pairs – each pair is an object.
  const [headingPairs, setHeadingPairs] = useState([{ heading: "", detail: "" }]);

  // Fetch tool details when component mounts.
  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/${id}`)
        .then((response) => {
          const tool = response.data;
          setFormData({
            title: tool.title || "",
            toolCategory: tool.toolCategory || "Tech",
            description: tool.description || "",
            content: tool.content || "",
            externalLink: tool.externalLink || "",
            shortdescription: tool.shortdescription || ""
          });
          if (tool.thumbnail) {
            setExistingThumbnail(tool.thumbnail);
            setThumbnailPreview(tool.thumbnail);
          }
          // Assume tool.heading and tool.details are arrays.
          if (tool.heading && tool.details) {
            const pairs = tool.heading.map((h, index) => ({
              heading: h,
              detail: tool.details[index] || ""
            }));
            setHeadingPairs(pairs);
          } else {
            setHeadingPairs([{ heading: "", detail: "" }]);
          }
        })
        .catch((err) => {
          console.error("Error fetching tool details:", err);
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

  const handleHeadingPairChange = (index, field, value) => {
    setHeadingPairs((prev) => {
      const newPairs = [...prev];
      newPairs[index] = { ...newPairs[index], [field]: value };
      return newPairs;
    });
  };

  const addHeadingPair = () => {
    setHeadingPairs((prev) => [...prev, { heading: "", detail: "" }]);
  };

  const removeHeadingPair = (index) => {
    setHeadingPairs((prev) => prev.filter((_, i) => i !== index));
  };

  // When the description content changes.
  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  // When the content (rich text) changes.
  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  // Function to inject inline table border styles (if needed)
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

    // Inject inline table styles into description and content
    const updatedDescription = injectTableBorders(formData.description);
    const updatedContent = injectTableBorders(formData.content);

    // Update headingPairs details with injected table borders
    const updatedHeadingPairs = headingPairs.map((pair) => ({
      heading: pair.heading,
      detail: injectTableBorders(pair.detail)
    }));

    const data = new FormData();

    // Append basic fields with the updated HTML content.
    data.append("title", formData.title);
    data.append("toolCategory", formData.toolCategory);
    data.append("shortdescription", formData.shortdescription);
    data.append("description", updatedDescription);
    data.append("content", updatedContent);
    data.append("externalLink", formData.externalLink);

    // Append the thumbnail file if a new file is selected.
    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }

    // Convert headingPairs into two arrays: one for headings and one for details.
    const headingsArray = updatedHeadingPairs.map((pair) => pair.heading);
    const detailsArray = updatedHeadingPairs.map((pair) => pair.detail);

    data.append("heading", JSON.stringify(headingsArray));
    data.append("details", JSON.stringify(detailsArray));

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/edit/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Tool updated successfully.");
      router.push("/admin/opulententrepreneurs/open/tools"); // redirect to tools list after update
    } catch (error) {
      console.error("Error updating tool:", error);
      alert("Error updating tool.");
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
                        <h4>Edit Tool</h4>
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

                          {/* Tool Category */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Type
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <select
                                className="form-control selectric"
                                name="toolCategory"
                                value={formData.toolCategory}
                                onChange={handleChange}
                              >
                                <option value="Tech">Tech</option>
                                <option value="News">News</option>
                                <option value="Political">Political</option>
                              </select>
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

                          {/* Description using TextEditor */}
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

                          {/* Content using TextEditor */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Content
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <TextEditor
                                onChange={handleContentChange}
                                initialValue={formData.content}
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

                          {/* Heading & Detail Pairs */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Headings & Details
                            </label>
                            <div className="col-sm-12 col-md-7">
                              {headingPairs.map((pair, index) => (
                                <div key={index}>
                                  {headingPairs.length > 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={() => removeHeadingPair(index)}
                                    >
                                      Remove
                                    </button>
                                  )}
                                  <div className="d-flex mb-2">
                                    <input
                                      type="text"
                                      className="form-control mr-2"
                                      placeholder="Heading"
                                      value={pair.heading}
                                      onChange={(e) =>
                                        handleHeadingPairChange(index, "heading", e.target.value)
                                      }
                                      required
                                    />
                                    <TextEditor
                                      onChange={(content) =>
                                        handleHeadingPairChange(index, "detail", content)
                                      }
                                      initialValue={pair.detail}
                                    />
                                  </div>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addHeadingPair}
                              >
                                Add Heading & Detail
                              </button>
                            </div>
                          </div>

                          {/* External Link */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              External Link
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <input
                                type="text"
                                className="form-control"
                                name="externalLink"
                                value={formData.externalLink}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="form-group row mb-4">
                            <div className="col-sm-12 col-md-7 offset-md-3">
                              <button type="submit" className="btn btn-primary">
                                Update Tool
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
            {/* (Optional: Add a settings sidebar here if needed) */}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTool;
