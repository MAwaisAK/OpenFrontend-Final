"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import { useRouter } from "next/navigation";
import { fetchMe } from "@/app/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const LiftAiEditor = () => {
  const [me, setMe] = useState(null); // <- new state for current user
  const router = useRouter();
  const [loading3, setLoading3] = useState(true);
  const [loading2, setLoading2] = useState(true);

  // Fetch current user on mount
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
      if (me && (me.level !== "super" && me.level !== "ai")) {
        router.push("/admin/opulententrepreneurs/open/dashboard");
      } else {
        setLoading2(false); // Only allow render when authorized
      }
    }
  }, [me, loading3]);
  const [prompt, setPrompt] = useState("");

  // Fetch the current LiftAi prompt
  const fetchLiftAiData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/lift-ai/prompt`);
      if (res.data.success && res.data.data?.prompt) {
        setPrompt(res.data.data.prompt);
      } else {
        setPrompt("");
      }
    } catch (error) {
      console.error("Error fetching LiftAi prompt:", error);
    }
  };

  useEffect(() => {
    fetchLiftAiData();
  }, []);

  // Save updated prompt
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/lift-ai/prompt`, {
        prompt,
      });
      if (res.data.success) {
        alert("Prompt saved successfully.");
      } else {
        alert("Error saving prompt.");
      }
    } catch (error) {
      console.error("Error saving LiftAi prompt:", error);
      alert("Error saving prompt.");
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
                <h4>Edit LiftAi Prompt</h4>
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-info btn-sm"
                    onClick={fetchLiftAiData}
                  >
                    Refresh Prompt
                  </button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label htmlFor="promptTextArea">Prompt</label>
                    <textarea
                      id="promptTextArea"
                      className="form-control"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter the prompt text..."
                      style={{ minHeight: "500px", height: "auto", overflowY: "auto" }}
                    />

                  </div>
                  <div className="form-group mt-4">
                    <button type="submit" className="btn btn-success">
                      Save Prompt
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiftAiEditor;
