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
  fetchToolsArray, fetchMe
} from "@/app/api"; // Import new API functions
import { useRouter } from "next/navigation";

const CreateTool = () => {
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
    toolCategory: "Tech",
    description: "",
    content: "",
    externalLink: "",
    shortdescription: "",
  });

  const [tools, setTools] = useState([]);

  // Fetch initial categories (tools) on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchToolsArray();
        // Assuming response.data is an array of tool categories
        setTools(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);


  // Thumbnail file and its preview URL.
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [pricePairs, setPricePairs] = useState([{ priceHeading: "", price: "" }]);

  const handlePricePairChange = (index, field, value) => {
    setPricePairs((prev) => {
      const newPairs = [...prev];
      newPairs[index] = { ...newPairs[index], [field]: value };
      return newPairs;
    });
  };

  const addPricePair = () => {
    setPricePairs((prev) => [...prev, { priceHeading: "", price: "" }]);
  };

  const removePricePair = (index) => {
    setPricePairs((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic heading & detail pairs – each pair is an object.

  // Handle basic text inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update thumbnail state and generate a preview.
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };
  // Handle changes from the TextEditor for description.
  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
  };

  // Handle changes from the TextEditor for content.
  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content: content }));
  };

  // Function to inject inline border styles into table elements
  const injectTableBorders = (htmlString) => {
    if (!htmlString) return htmlString;
    const container = document.createElement("div");
    container.innerHTML = htmlString;
    const tables = container.querySelectorAll("table");
    tables.forEach((table) => {
      // Append inline style for the table element
      const currentStyle = table.getAttribute("style") || "";
      const borderStyle = "border: 1px solid #000; border-collapse: collapse;";
      table.setAttribute("style", currentStyle + borderStyle);

      // Also add border style to table header cells and regular cells
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

    // Inject inline table styles into description and content
    const updatedDescription = injectTableBorders(formData.description);
    const updatedContent = injectTableBorders(formData.content);

    const data = new FormData();

    // Append basic form fields with the updated HTML content.
    data.append("title", formData.title);
    data.append("toolCategory", formData.toolCategory);
    data.append("shortdescription", formData.shortdescription);
    data.append("description", updatedDescription);
    data.append("content", updatedContent);
    data.append("externalLink", formData.externalLink);
    data.append("price_heading", JSON.stringify(pricePairs.map((p) => p.priceHeading)));
    data.append("price", JSON.stringify(pricePairs.map((p) => p.price)));

    // Append the thumbnail file.
    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Tool created successfully.");
      // Optionally, reset the form or redirect.
    } catch (error) {
      console.error("Error creating tool:", error);
      alert("Error creating tool.");
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
                        <h4>Enter Tool Details</h4>
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
                              <TextEditor onChange={handleDescriptionChange} />
                            </div>
                          </div>

                          {/* Content using TextEditor */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Content
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <TextEditor onChange={handleContentChange} />
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

                          {/* Heading & Details Pairs */}
                          <div className="form-group">
                            <label>Price Details</label>
                            {pricePairs.map((pair, index) => (
                              <div key={index} className="d-flex align-items-center mb-2">
                                <input type="text" className="form-control mr-2" placeholder="Price Heading" value={pair.priceHeading} onChange={(e) => handlePricePairChange(index, "priceHeading", e.target.value)} required />
                                <input type="number" className="form-control mr-2" placeholder="Price" value={pair.price} onChange={(e) => handlePricePairChange(index, "price", e.target.value)} required />
                                {pricePairs.length > 1 && (
                                  <button type="button" className="btn btn-danger" onClick={() => removePricePair(index)}>X</button>
                                )}
                              </div>
                            ))}
                            <button type="button" className="btn btn-primary mt-2" onClick={addPricePair}>Add Price</button>
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
                                Create Tool
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

export default CreateTool;
