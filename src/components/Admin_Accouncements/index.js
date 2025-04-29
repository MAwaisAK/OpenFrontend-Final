"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import "../../styles/admin_assets/css/app.min.css";
import "../../styles/admin_assets/css/components.css";

export default function TestimonialManager() {
  // State for testimonials
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
                <h2 className="section-title">Send Annoucements</h2>

                {/* Add or Update Testimonial Form */}
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>Annoucements</h4>
                      </div>
                      <div className="card-body">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Message</label>
                          <textarea
                            className="form-control"
                            name="message"
                            rows="3"
                            required
                          ></textarea>
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
}
