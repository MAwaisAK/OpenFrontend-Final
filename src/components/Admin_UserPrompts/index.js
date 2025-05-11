"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Script from "next/script";
import Resources from "../Admin_Scripts";
import { fetchUserPrompts } from "@/app/api";
import "../../styles/admin_assets/bundles/datatables/datatables.min.css";
import "../../styles/admin_assets/bundles/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css";

const UserPrompts = () => {
  const [prompts, setPrompts] = useState([]);

  // Fetch user prompts when component mounts
  useEffect(() => {
    const getPrompts = async () => {
      try {
        const data = await fetchUserPrompts();
        setPrompts(data.data);
      } catch (error) {
        console.error("Error fetching user prompts:", error);
      }
    };
    getPrompts();
  }, []);

  // Initialize DataTables once data is loaded
  useEffect(() => {
    if (typeof window !== "undefined" && window.$ && window.$.fn && window.$.fn.DataTable) {
      if (window.$.fn.DataTable.isDataTable('#table-1')) {
        window.$('#table-1').DataTable().destroy();
      }
      window.$('#table-1').DataTable();
    }
  }, [prompts]);

  return (
    <>
      <Resources />
      <Script src="/assets/admin_assets/bundles/jquery-selectric/jquery.selectric.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/upload-preview/assets/js/jquery.uploadPreview.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/summernote/summernote-bs4.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/js/page/create-post.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/datatables/datatables.min.js" strategy="afterInteractive" />
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
                        <h4>User Prompts</h4>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-striped" id="table-1">
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th>User</th>
                                <th>Total Tokens Used</th>
                              </tr>
                            </thead>
                            <tbody>
                              {prompts.map((prompt, index) => (
                                <tr key={prompt._id || index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td>
                                    <a
                                      href={`/profile/tribers/${prompt.userId}`}
                                    >
                                      {prompt.user.username}
                                    </a>
                                  </td>
                                  <td>{prompt.tokens_used}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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

export default UserPrompts;
