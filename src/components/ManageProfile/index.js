"use client";
import { useState, useEffect } from "react";
import Sidebar from "../AdminSideBar";
import Navbar from "../Nav";
import { createSupportReport, fetchMe, fetchSupportArray } from "@/app/api"; // Adjust the path as needed

const MyTribes = () => {
  const [issueType, setIssueType] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [supportOptions, setSupportOptions] = useState([]);

  // Fetch support options on component mount
  useEffect(() => {
    const fetchSupportOptions = async () => {
      try {
        const response = await fetchSupportArray();
        setSupportOptions(response.data || []);
      } catch (error) {
        console.error("Error fetching support options:", error);
      }
    };
    fetchSupportOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!issueType || !issueDescription) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      // Get the current user data
      const currentUser = await fetchMe();
      // Extract the user id; adjust the property name based on your API's response (e.g., _id or id)
      const userId = currentUser?.id || currentUser?._id;

      // Build the report data; note that the backend expects "Description"
      const reportData = {
        type: issueType,
        Description: issueDescription,
        user: userId,
      };

      await createSupportReport(reportData);
      setMessage("Report submitted successfully.");
      setIssueType("");
      setIssueDescription("");
    } catch (error) {
      console.error("Error submitting report:", error);
      setMessage("Error submitting report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     {/*<Navbar />*/}
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="row">
              <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Support</h4>
                    {message && <p className="alert alert-info">{message}</p>}
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="issueType">Type of Issue</label>
                        <select
                          className="form-select"
                          id="issueType"
                          value={issueType}
                          onChange={(e) => setIssueType(e.target.value)}
                        >
                          <option value="">Select Issue Type</option>
                          {supportOptions.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="issueDescription">Issue Description</label>
                        <textarea
                          className="form-control"
                          id="issueDescription"
                          rows="4"
                          placeholder="Describe the issue here..."
                          value={issueDescription}
                          onChange={(e) => setIssueDescription(e.target.value)}
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary me-2"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Add any additional components or footer as needed */}
        </div>
      </div>
    </>
  );
};

export default MyTribes;
