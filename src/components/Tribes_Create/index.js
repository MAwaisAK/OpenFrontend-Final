"use client";
import React, { useState,useEffect } from "react";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import { searchTribesUser, fetchMe } from "@/app/api";
import Resources from "../Admin_Scripts";
import axios from "axios";
import { TextEditor } from "./TextEditor";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useRouter } from "next/navigation"; // Next.js 13+ router

const CreateTribe = () => {
  const [me, setMe] = useState(null); // <- new state for current user
  const [loading, setLoading] = useState(true); // <- new state for current user
  const [loading2, setLoading2] = useState(true); // <- new state for current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetchMe();
        setMe(response); // assuming response contains user object directly
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false); // <- Move here to ensure it always runs after fetch
      }
    };

    getCurrentUser();
  }, []);


  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (me && (me.level !== "super" && me.level !== "community")) {
        router.push("/admin/opulententrepreneurs/open/dashboard");
      } else {
        setLoading2(false); // Only allow render when authorized
      }
    }
  }, [me, loading]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    tribeCategory: "",
    // joinPolicy: "open", // "open" or "closed"
    // membersLimit: 0, // 0 means no limit
    messageSettings: "all", // "all" or "admin"
  });
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // Files for thumbnail and banner with previews.
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Handle basic input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle thumbnail file selection.
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle banner file selection.
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await searchTribesUser(searchQuery);
      setSearchResults(res.users || []);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };
  const handleAddAdmin = (user) => {
    if (!admins.find(a => a._id === user._id)) {
      setAdmins(prev => [...prev, user]);
    }
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleRemoveAdmin = (userId) => {
    setAdmins(prev => prev.filter(u => u._id !== userId));
  };
  // Handle changes for rich text fields.
  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, longDescription: content }));
  };

  // Optional: You may allow a simple textarea for shortDescription.
  const handleShortDescriptionChange = (e) => {
    setFormData((prev) => ({ ...prev, shortDescription: e.target.value }));
  };

  // On form submission, pack data into a FormData object.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Append basic fields.
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("longDescription", formData.longDescription);
    data.append("tribeCategory", formData.tribeCategory);
    // data.append("joinPolicy", formData.joinPolicy);
    //data.append("membersLimit", formData.membersLimit);
    data.append("messageSettings", formData.messageSettings);
    data.append("admins", JSON.stringify(admins.map(u => u._id)));

    // Append thumbnail file.
    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }
    // Append banner file.
    if (banner) {
      data.append("banner", banner);
    }

    try {
      // Change the endpoint if needed.
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Tribe created successfully.");
      // Optionally, reset the form or redirect here.
    } catch (error) {
      console.error("Error creating tribe:", error);
      alert("Error creating tribe.");
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
                        <h4>Create New Tribe</h4>
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
                          {/* Short Description */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Short Description
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <textarea
                                className="form-control"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleShortDescriptionChange}
                                required
                              ></textarea>
                            </div>
                          </div>
                          {/* Long Description */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Long Description
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <TextEditor onChange={handleDescriptionChange} />
                            </div>
                          </div>
                          {/* Business Category */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Business Category
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <input
                                type="text"
                                className="form-control"
                                name="tribeCategory"
                                value={formData.tribeCategory}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          {/* Join Policy 
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Join Policy
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <select
                                className="form-control"
                                name="joinPolicy"
                                value={formData.joinPolicy}
                                onChange={handleChange}
                              >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          </div>*/}
                          {/* Members Limit 
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Members Limit
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <input
                                type="number"
                                className="form-control"
                                name="membersLimit"
                                value={formData.membersLimit}
                                onChange={handleChange}
                              />
                              <small className="form-text text-muted">
                                0 means no limit.
                              </small>
                            </div>
                          </div>*/}
                          <div className="form-group row mb-4">
                            <label className="col-md-3 col-form-label">Admins</label>
                            <div className="col-md-7">
                              {/* Selected admins */}
                              <div className="d-flex flex-wrap mb-2">
                                {admins.map(u => (
                                  <span
                                    key={u._id}
                                    className="badge bg-primary me-2 mb-2 d-flex align-items-center"
                                  >
                                    {u.username}
                                    <button
                                      type="button"
                                      className="btn-close btn-close-white btn-sm ms-2"
                                      onClick={() => handleRemoveAdmin(u._id)}
                                    />
                                  </span>
                                ))}
                              </div>

                              {/* Search bar */}
                              <div className="input-group mb-2">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search users..."
                                  value={searchQuery}
                                  onChange={e => setSearchQuery(e.target.value)}
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={handleSearch}
                                >
                                  Search
                                </button>
                              </div>

                              {/* Results */}
                              {searchResults.length > 0 && (
                                <ul className="list-group">
                                  {searchResults.map(u => (
                                    <li
                                      key={u._id}
                                      className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                      <div>
                                        <img
                                          src={u.profile_pic}
                                          alt=""
                                          width={30}
                                          height={30}
                                          className="rounded-circle me-2"
                                        />
                                        {u.firstName} {u.lastName} ({u.username})
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleAddAdmin(u)}
                                      >
                                        Add
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Message Settings
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <select
                                className="form-control"
                                name="messageSettings"
                                value={formData.messageSettings}
                                onChange={handleChange}
                              >
                                <option value="all">All</option>
                                <option value="admin">Admin Only</option>
                              </select>
                            </div>
                          </div>
                          {/* Thumbnail with Preview */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Thumbnail
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <div id="image-preview" className="image-preview">
                                <label htmlFor="thumbnail-upload" id="image-label">
                                  Choose File
                                </label>
                                <input
                                  type="file"
                                  name="thumbnail"
                                  id="thumbnail-upload"
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
                          {/* Banner with Preview */}
                          <div className="form-group row mb-4">
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              Banner
                            </label>
                            <div className="col-sm-12 col-md-7">
                              <div id="banner-preview" className="image-preview">
                                <label htmlFor="banner-upload" id="image-label">
                                  Choose File
                                </label>
                                <input
                                  type="file"
                                  name="banner"
                                  id="banner-upload"
                                  onChange={handleBannerChange}
                                  required
                                />
                                {bannerPreview && (
                                  <img
                                    src={bannerPreview}
                                    alt="Banner Preview"
                                    style={{ width: "200px", marginTop: "10px" }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Submit Button */}
                          <div className="form-group row mb-4">
                            <div className="col-sm-12 col-md-7 offset-md-3">
                              <button type="submit" className="btn btn-primary">
                                Create Tribe
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

export default CreateTribe;
