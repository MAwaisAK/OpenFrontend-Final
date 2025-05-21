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
import {
  fetchMe
} from "@/app/api"; // Import new API functions

const EditTool = () => {
  const router = useRouter();
  const { id } = useParams();
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

  // --- State for basic fields ---
  const [formData, setFormData] = useState({
    title: "",
    toolCategory: "Tech",
    description: "",
    content: "",
    externalLink: "",
    shortdescription: ""
  });

  // --- Thumbnail state ---
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // --- Parallel arrays for price-heading & price-detail ---
  const [priceHeading, setPriceHeading] = useState([""]);
  const [existingThumbnail, setExistingThumbnail] = useState(null);
  const [priceDetail, setPriceDetail] = useState([""]);

  // Load existing tool data
  useEffect(() => {
    if (!id) return;

    axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/${id}`)
      .then(({ data: tool }) => {
        // Populate basic fields
        setFormData({
          title: tool.title || "",
          toolCategory: tool.toolCategory || "Tech",
          description: tool.description || "",
          content: tool.content || "",
          externalLink: tool.externalLink || "",
          shortdescription: tool.shortdescription || ""
        });

        // Thumbnail preview
        if (tool.thumbnail) {
          setThumbnailPreview(tool.thumbnail);
          setExistingThumbnail(tool.thumbnail);
        }

        // Parse price_heading & price (could be JSON strings or arrays)
        const ph = Array.isArray(tool.price_heading)
          ? tool.price_heading
          : (tool.price_heading ? JSON.parse(tool.price_heading) : []);
        const pd = Array.isArray(tool.price)
          ? tool.price
          : (tool.price ? JSON.parse(tool.price) : []);

        setPriceHeading(ph.length ? ph : [""]);
        setPriceDetail(pd.length ? pd : [""]);
      })
      .catch(console.error);
  }, [id]);

  // Handle input changes for basic fields
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  // Thumbnail change
  const handleThumbnailChange = e => {
    const file = e.target.files[0];
    setThumbnail(file);
    setThumbnailPreview(file ? URL.createObjectURL(file) : existingThumbnail);
  };


  // Inject borders into any <table> in the HTML string
  const injectTableBorders = html => {
    if (!html) return html;
    const div = document.createElement("div");
    div.innerHTML = html;
    div.querySelectorAll("table").forEach(tbl => {
      tbl.style.cssText += "border:1px solid #000;border-collapse:collapse;";
      tbl.querySelectorAll("th,td").forEach(c => {
        c.style.cssText += "border:1px solid #000;";
      });
    });
    return div.innerHTML;
  };

  // Handlers for the rich-text editors
  const handleDescriptionChange = content =>
    setFormData(fd => ({ ...fd, description: content }));
  const handleContentChange = content =>
    setFormData(fd => ({ ...fd, content }));

  // Handlers for price-heading & price-detail arrays
  const handleHeadingChange = (idx, val) => {
    setPriceHeading(ph => ph.map((v, i) => i === idx ? val : v));
  };
  const handleDetailChange = (idx, val) => {
    setPriceDetail(pd => pd.map((v, i) => i === idx ? val : v));
  };
  const addPriceRow = () => {
    setPriceHeading(ph => [...ph, ""]);
    setPriceDetail(pd => [...pd, ""]);
  };
  const removePriceRow = idx => {
    setPriceHeading(ph => ph.filter((_, i) => i !== idx));
    setPriceDetail(pd => pd.filter((_, i) => i !== idx));
  };

  // On submit, assemble FormData and send
  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();

    // Inject borders
    data.append("description", injectTableBorders(formData.description));
    data.append("content", injectTableBorders(formData.content));

    // Basic fields
    data.append("title", formData.title);
    data.append("toolCategory", formData.toolCategory);
    data.append("shortdescription", formData.shortdescription);
    data.append("externalLink", formData.externalLink);

    // Thumbnail if newly selected
    if (thumbnail) data.append("thumbnail", thumbnail);

    // Append price arrays as multiple form fields
    priceHeading.forEach(h => data.append("price_heading", h));
    priceDetail.forEach(d => data.append("price", d));

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/tool/edit/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Tool updated successfully.");
      router.push("/admin/opulententrepreneurs/open/tools");
    } catch (err) {
      console.error(err);
      alert("Error updating tool.");
    }
  };

  // Renders the dynamic Price & Detail panel
  const renderPricePanel = () => (
    <div className="form-group row mb-4">
      <label className="col-md-3 col-form-label">Price & Detail</label>
      <div className="col-md-7">
        {priceHeading.map((h, i) => (
          <div key={i} className="d-flex mb-2">
            <input
              type="text"
              className="form-control mr-2"
              placeholder="Heading (e.g. Free)"
              value={h}
              onChange={e => handleHeadingChange(i, e.target.value)}
              required
            />
            <input
              type="number"
              className="form-control mr-2"
              placeholder="Detail (e.g. 0)"
              value={priceDetail[i]}
              onChange={e => handleDetailChange(i, e.target.value)}
              required
            />
            {priceHeading.length > 1 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removePriceRow(i)}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          onClick={addPriceRow}
        >
          Add Row
        </button>
      </div>
    </div>
  );


  if (loading2) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <Resources />
      <div id="app">
        <div className="main-wrapper main-wrapper-1">
          <div className="navbar-bg" />
          <Navbar />
          <Sidebar />

          <div className="main-content">
            <section className="section">
              <div className="section-body">

                <div className="card">
                  <div className="card-header">
                    <h4>Edit Tool</h4>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>

                      {/* Title */}
                      <div className="form-group row mb-4">
                        <label className="col-md-3 col-form-label">Title</label>
                        <div className="col-md-7">
                          <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="form-group row mb-4">
                        <label className="col-md-3 col-form-label">Type</label>
                        <div className="col-md-7">
                          <select
                            name="toolCategory"
                            value={formData.toolCategory}
                            onChange={handleChange}
                            className="form-control"
                          >
                            <option>Tech</option>
                            <option>News</option>
                            <option>Political</option>
                          </select>
                        </div>
                      </div>

                      {/* Short Description */}
                      <div className="form-group row mb-4">
                        <label className="col-md-3 col-form-label">
                          Short Description
                        </label>
                        <div className="col-md-7">
                          <textarea
                            name="shortdescription"
                            value={formData.shortdescription}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="form-group row mb-4">
                        <label className="col-md-3 col-form-label">Description</label>
                        <div className="col-md-7">
                          <TextEditor
                            initialValue={formData.description}
                            onChange={handleDescriptionChange}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="form-group row mb-4">
                        <label className="col-md-3 col-form-label">Content</label>
                        <div className="col-md-7">
                          <TextEditor
                            initialValue={formData.content}
                            onChange={handleContentChange}
                          />
                        </div>
                      </div>

                      {/* Thumbnail */}
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

                      {/* Price & Detail */}
                      {renderPricePanel()}

                      {/* External Link */}
                      <div className="form-group row mb-4">
                        <label className="col-md-3 col-form-label">External Link</label>
                        <div className="col-md-7">
                          <input
                            name="externalLink"
                            value={formData.externalLink}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="form-group row mb-4">
                        <div className="col-md-7 offset-md-3">
                          <button className="btn btn-success">Update Tool</button>
                        </div>
                      </div>

                    </form>
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

export default EditTool;
