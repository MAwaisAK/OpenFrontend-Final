"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { fetchMe, searchTribesUser } from "@/app/api"; // make sure to import searchTribesUser
import "@/styles/profile-style.css";
import { TextEditor } from "../Tribes_Edit/TextEditor";
import 'bootstrap/dist/js/bootstrap.bundle.min'; // ensure bootstrap JS is loaded

const MyTribeDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // ──────── ALL STATE/HOOKS AT TOP ──────────────────
  const [tribe, setTribe] = useState(null);
  const [user, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("members"); // "members" | "blocked" | "edit"
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [rating, setRating] = useState(1);

  // Toast refs
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);

  // Helper to show a toast
  const showToast = (ref) => {
    const toast = new bootstrap.Toast(ref.current);
    toast.show();
  };

  // Edit‐form state
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    tribeCategory: "",
    messageSettings: "all",
  });
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // ──────── FETCH CURRENT USER ──────────────────
  useEffect(() => {
    fetchMe()
      .then(setUserData)
      .catch(console.error);
  }, []);

  // ──────── FETCH TRIBE DETAILS ──────────────────
  useEffect(() => {
    if (!id) return setLoading(false);
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/get-tribe/${id}`)
      .then(({ data }) => {
        setTribe(data);
        // also initialize edit‐form from fetched data:
        setFormData({
          title: data.title || "",
          shortDescription: data.shortDescription || "",
          longDescription: data.longDescription || "",
          tribeCategory: data.tribeCategory || "",
          messageSettings: data.messageSettings || "all",
        });
        setAdmins(data.admins || []);
        if (data.thumbnail) setThumbnailPreview(data.thumbnail);
        if (data.banner) setBannerPreview(data.banner);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ──────── CLOSE DROPDOWN ON OUTSIDE CLICK ──────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ──────── EARLY RETURNS ──────────────────
  if (loading) return <div>Loading tribe data...</div>;
  if (!tribe) return <div>Tribe not found or failed to load.</div>;

  // ──────── DERIVED FLAGS & SORTED MEMBERS ──────────────────
  const isUserAdmin = tribe.admins.some((a) => a._id === user?._id);
  const isUserBlocked = tribe.blockedUsers.some((b) => b._id === user?._id);
  const isUserJoined = user?.joined_tribes?.includes(tribe._id);

  const sortedMembers = [
    // admins first
    ...tribe.members.filter((m) =>
      tribe.admins.some((a) => a._id === m._id)
    ),
    // then non-admins
    ...tribe.members.filter(
      (m) => !tribe.admins.some((a) => a._id === m._id)
    ),
  ];

  const averageRating = tribe.ratings.length
    ? tribe.ratings.reduce((sum, r) => sum + r.rating, 0) / tribe.ratings.length
    : 0;

  const DEFAULT_BANNER =
    "https://wikitravel.org/upload/shared//6/6a/Default_Banner.jpg";
  const DEFAULT_AVATAR = "/assets/admin_assets/img/users/user.png";

  // ──────── HANDLERS ──────────────────
  const handleRateClick = () => {
    setShowRateModal(true);
    setShowDropdown(false);
  };
  const handleLeaveClick = async () => {
    setShowDropdown(false);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/leave-tribe`,
        { tribeId: tribe._id, userId: user._id }
      );
      successToastRef.current.querySelector(".toast-body").innerText = data.message;
      showToast(successToastRef);
     setTimeout(() => {
        router.push("/profile/user-tribes");
     }, 1500);
      
    } catch {
      errorToastRef.current.querySelector(".toast-body").innerText = "Error leaving tribe.";
      showToast(errorToastRef);
    }
  };
  const handleRemoveClick = async (memberId) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/remove-member`,
        { tribeId: tribe._id, memberId }
      );
      successToastRef.current.querySelector(".toast-body").innerText = data.message;
      showToast(successToastRef);
      setTribe(data.tribe);
    } catch {
      errorToastRef.current.querySelector(".toast-body").innerText = "Error removing member.";
      showToast(errorToastRef);
    }
  };
  const handleBlockMember = async (memberId) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/${tribe._id}/block/${memberId}`
      );
      successToastRef.current.querySelector(".toast-body").innerText =data.message;
      showToast(successToastRef);
      setTribe(data.tribe);
    } catch {
      successToastRef.current.querySelector(".toast-body").innerText = "Error blocking user.";
      showToast(errorToastRef);
    }
  };
  const handleJoinTribe = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/join-tribe`,
        { tribeId: tribe._id, userId: user._id }
      );
      successToastRef.current.querySelector(".toast-body").innerText = "Successfully joined the tribe!";
      showToast(successToastRef);
      setTribe((prev) => ({
        ...prev,
        members: [...prev.members, user],
      }));
    } catch {
      successToastRef.current.querySelector(".toast-body").innerText = "Failed to join the tribe.";
      showToast(errorToastRef);
    }
  };
  const handleRateSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/${tribe._id}/rate`,
        { userId: user._id, rating }
      );
      successToastRef.current.querySelector(".toast-body").innerText = data.message;
      showToast(successToastRef);
      setShowRateModal(false);
    } catch {
            successToastRef.current.querySelector(".toast-body").innerText = "Error rating tribe.";
      showToast(errorToastRef);
    }
  };

  // Edit‐form handlers:
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleShortDescriptionChange = (e) =>
    setFormData((p) => ({ ...p, shortDescription: e.target.value }));
  const handleDescriptionChange = (content) =>
    setFormData((p) => ({ ...p, longDescription: content }));
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    if (file) setBannerPreview(URL.createObjectURL(file));
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await searchTribesUser(searchQuery);
      setSearchResults(res.users || []);
    } catch {
      console.error("Search failed");
    }
  };
  const handleAddAdmin = (u) => {
    if (!admins.find((a) => a._id === u._id)) setAdmins((p) => [...p, u]);
    setSearchResults([]);
    setSearchQuery("");
  };
  const handleRemoveAdmin = (uid) =>
    setAdmins((p) => p.filter((u) => u._id !== uid));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("longDescription", formData.longDescription);
    data.append("tribeCategory", formData.tribeCategory);
    data.append("messageSettings", formData.messageSettings);
    data.append("admins", JSON.stringify(admins.map((u) => u._id)));
    if (thumbnail) data.append("thumbnail", thumbnail);
    if (banner) data.append("banner", banner);

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/my-tribes/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      successToastRef.current.querySelector(".toast-body").innerText = "Tribe updated successfully.";
      showToast(successToastRef);
    } catch {
      successToastRef.current.querySelector(".toast-body").innerText = "Error updating tribe.";
      showToast(errorToastRef);
    }
  };

  return (
    <>
      {/* Stylesheets */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-beta/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600"
      />

      <div className="userprofile-container">
        {/* Banner */}
        <header
          className="userprofile-header"
          style={{
            backgroundImage: `url(${
              isUserBlocked ? DEFAULT_BANNER : tribe.banner || DEFAULT_BANNER
            })`,
          }}
        />

        <main className="userprofile-main">
          <div className="row">
            {/* Left Col */}
            <div className="userprofile-left col-lg-4">
              <div className="userprofile-photo-left">
                <img
                  className="userprofile-photo"
                  src={
                    isUserBlocked
                      ? DEFAULT_AVATAR
                      : tribe.thumbnail || DEFAULT_AVATAR
                  }
                  alt={tribe.title}
                />
              </div>
              {!isUserBlocked && (
                <div className="dropdown" ref={dropdownRef}>
                  <i
                    className="fa-solid fa-ellipsis-h"
                    onClick={() => setShowDropdown((v) => !v)}
                    style={{ cursor: "pointer" }}
                  />
                  {showDropdown && (
                    <ul
                      className="dropdown-menu show"
                      style={{ left: "-150px" }}
                    >
                      <li onClick={handleRateClick}>Rate</li>
                      <li onClick={handleLeaveClick}>Leave</li>
                    </ul>
                  )}
                </div>
              )}
              <h4 className="userprofile-name">{tribe.title}</h4>
              <p className="userprofile-info">{tribe.tribeCategory}</p>
              <p
                className="userprofile-desc"
                dangerouslySetInnerHTML={{ __html: tribe.shortDescription }}
              />
              <h4>About Tribe</h4>
              <p
                className="userprofile-desc"
                dangerouslySetInnerHTML={{ __html: tribe.longDescription }}
              />
              <div className="userprofile-stats row">
                <div className="userprofile-stat col-xs-4">
                  <p className="userprofile-number-stat">
                    {tribe.members?.length || 0}
                  </p>
                  <p className="userprofile-desc-stat">Members</p>
                </div>
                <div className="userprofile-stat col-xs-4">
                  <p className="userprofile-number-stat">
                    {averageRating.toFixed(1)}
                  </p>
                  <p className="userprofile-desc-stat">Rating</p>
                </div>
              </div>
            </div>

            {/* Right Col */}
            <div className="userprofile-right col-lg-8">
              <div className="userprofile-actions mb-3">
                {!isUserJoined ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleJoinTribe}
                    disabled={isUserBlocked}
                  >
                    Join Tribe
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() =>setTimeout(() => {
                      router.push(`/profile/tribe-chat/${id}`)
                    }, 1500) }
                  >
                    Go to Chat
                  </button>
                )}
              </div>

              <ul className="userprofile-nav">
                <li
                  className={activeTab === "members" ? "active" : ""}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </li>
                {isUserAdmin && (
                  <>
                  <li
                    className={activeTab === "blocked" ? "active" : ""}
                    onClick={() => setActiveTab("blocked")}
                  >
                    Blocked Users
                  </li>
                  <li
                  className={activeTab === "edit" ? "active" : ""}
                  onClick={() => setActiveTab("edit")}
                >
                  Edit
                </li></>
                )}
              </ul>

              {/* Members Tab */}
              {activeTab === "members" && (
                <ul className="tribe-list">
                  {!isUserBlocked ? (
                    sortedMembers.length > 0 ? (
                      sortedMembers.map((m) => {
                        const isMemberAdmin = tribe.admins.some(
                          (a) => a._id === m._id
                        );
                        return (
                          <li
                            key={m._id}
                            className="tribe-item d-flex align-items-center"
                          >
                            {/* Crown for admins */}
                            {isMemberAdmin && (
                              <i
                                className="fa-solid fa-crown me-1"
                                title="Admin"
                                style={{ color: "gold" }}
                              />
                            )}
                            <img
                              className="tribe-thumbnail-img me-2"
                              src={m.profile_pic || DEFAULT_AVATAR}
                              alt={m.username || m.firstName}
                            />
                            <strong className="tribe-title">
                              {m.username || m.firstName}
                            </strong>
                            {/* Only non-admins get remove/block */}
                            {isUserAdmin && !isMemberAdmin && (
                              <div
                                className="ms-auto admin-actions"
                                style={{ fontSize: "1.2rem" }}
                              >
                                <i
                                  className="fa-solid fa-user-minus me-2"
                                  onClick={() => handleRemoveClick(m._id)}
                                  title="Remove Member"
                                  style={{ cursor: "pointer" }}
                                />
                                <i
                                  className="fa-solid fa-user-slash"
                                  onClick={() => handleBlockMember(m._id)}
                                  title="Block Member"
                                  style={{ cursor: "pointer" }}
                                />
                              </div>
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <li>No members found</li>
                    )
                  ) : (
                    <li>You are blocked from this tribe.</li>
                  )}
                </ul>
              )}

              {/* Blocked Users Tab */}
              {activeTab === "blocked" && isUserAdmin && (
                <ul className="tribe-list">
                  {tribe.blockedUsers?.length > 0 ? (
                    tribe.blockedUsers.map((b) => (
                      <li
                        key={b._id}
                        className="tribe-item d-flex align-items-center"
                      >
                        <img
                          className="tribe-thumbnail-img me-2"
                          src={b.profile_pic || DEFAULT_AVATAR}
                          alt={b.username || b.firstName}
                        />
                        <strong className="tribe-title">
                          {b.username || b.firstName}
                        </strong>
                      </li>
                    ))
                  ) : (
                    <li>No blocked users found</li>
                  )}
                </ul>
              )}
               {activeTab === "edit" && isUserAdmin && (
                 <div className="section-body">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="card">
                                      <div className="card-header">
                                        <h4>Edit Tribe</h4>
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
                                              <TextEditor
                                                initialValue={formData.longDescription}
                                                onChange={handleDescriptionChange}
                                              />
                                            </div>
                                          </div>
                
                                          {/* Category */}
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
                
                                          {/* Admins picker */}
                                          <div className="form-group row mb-4">
                                            <label className="col-md-3 col-form-label">
                                              Admins
                                            </label>
                                            <div className="col-md-7">
                                              <div className="d-flex flex-wrap mb-2">
                                                {admins.map((u) => (
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
                                              <div className="input-group mb-2">
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Search users..."
                                                  value={searchQuery}
                                                  onChange={(e) =>
                                                    setSearchQuery(e.target.value)
                                                  }
                                                />
                                                <button
                                                  type="button"
                                                  className="btn btn-outline-secondary"
                                                  onClick={handleSearch}
                                                >
                                                  Search
                                                </button>
                                              </div>
                                              {searchResults.length > 0 && (
                                                <ul className="list-group">
                                                  {searchResults.map((u) => (
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
                                                        {u.firstName} {u.lastName} (
                                                        {u.username})
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
                
                                          {/* Message Settings */}
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
                
                                          {/* Thumbnail */}
                                          <div className="form-group row mb-4">
                                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                                              Thumbnail
                                            </label>
                                            <div className="col-sm-12 col-md-7">
                                              <input
                                                type="file"
                                                name="thumbnail"
                                                onChange={handleThumbnailChange}
                                              />
                                              {thumbnailPreview && (
                                                <img
                                                  src={thumbnailPreview}
                                                  alt="Thumbnail Preview"
                                                  style={{ width: "200px", marginTop: 10 }}
                                                />
                                              )}
                                            </div>
                                          </div>
                
                                          {/* Banner */}
                                          <div className="form-group row mb-4">
                                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                                              Banner
                                            </label>
                                            <div className="col-sm-12 col-md-7">
                                              <input
                                                type="file"
                                                name="banner"
                                                onChange={handleBannerChange}
                                              />
                                              {bannerPreview && (
                                                <img
                                                  src={bannerPreview}
                                                  alt="Banner Preview"
                                                  style={{ width: "200px", marginTop: 10 }}
                                                />
                                              )}
                                            </div>
                                          </div>
                
                                          {/* Submit */}
                                          <div className="form-group row mb-4">
                                            <div className="col-sm-12 col-md-7 offset-md-3">
                                              <button
                                                type="submit"
                                                className="btn btn-primary"
                                              >
                                                Save Changes
                                              </button>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Rate Modal */}
      {showRateModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rate Tribe</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowRateModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleRateSubmit}>
                <div className="modal-body">
                  <p>Select a rating:</p>
                  <select
                    className="form-control"
                    value={rating}
                    onChange={(e) => setRating(+e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowRateModal(false)}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div
        ref={successToastRef}
        className="toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-4"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">Action succeeded.</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>

      {/* Error Toast */}
      <div
        ref={errorToastRef}
        className="toast align-items-center text-white bg-danger border-0 position-fixed bottom-0 end-0 m-4"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="d-flex">
          <div className="toast-body">Action failed.</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </>
  );
};

export default MyTribeDetails;
