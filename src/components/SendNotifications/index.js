"use client";
import { useState, useEffect } from "react";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import {
  sendNotificationToAllUsers,
} from "@/app/api"; // Import new API functions

import "../../styles/admin_assets/bundles/summernote/summernote-bs4.css";
import "../../styles/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.css";
import Script from "next/script";

const Notification = () => {
  const [announcement, setAnnouncement] = useState("");

  const handleSendAnnouncement = async () => {
    if (announcement.trim().length === 0 || announcement.length > 300) {
      alert("Announcement must be between 1 and 300 characters.");
      return;
    }

    try {
      await sendNotificationToAllUsers(announcement);
      alert("Announcement sent successfully!");
      setAnnouncement(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send announcement:", error);
      alert("Failed to send announcement.");
    }
  };

  return (
    <>
      <Resources />
      <Script src="/assets/admin_assets/bundles/jquery-selectric/jquery.selectric.min.js" strategy="beforeInteractive"></Script>
      <Script src="/assets/admin_assets/bundles/upload-preview/assets/js/jquery.uploadPreview.min.js" strategy="beforeInteractive"></Script>
      <Script src="/assets/admin_assets/bundles/summernote/summernote-bs4.js" strategy="beforeInteractive"></Script>
      <Script src="/assets/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js" strategy="beforeInteractive"></Script>
      <Script src="/assets/admin_assets/js/page/create-post.js" strategy="beforeInteractive"></Script>

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
                        <h4>Send Announcement</h4>
                      </div>
                      <div className="card-body">
                      <div className="form-group row mb-4">
      <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
        Short Announcement
      </label>
      <div className="col-sm-12 col-md-7">
        <textarea
          className="form-control"
          maxLength={300}
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Enter a short announcement (max 300 characters)"
        ></textarea>
      </div>
      <div className="col-sm-12 col-md-2">
        <button className="btn btn-primary" onClick={handleSendAnnouncement}>
          Send
        </button>
      </div>
    </div>
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

export default Notification;
