"use client";
import { useState } from "react";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import '../../styles/admin_assets/bundles/summernote/summernote-bs4.css';
import '../../styles/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.css';
import Script from 'next/script';

const defaultFields = [
  { label: "Question # 1", value: "Please enter your name:", type: "text" },
  { 
    label: "Please select Lift AI's Use Objective", 
    value: "Document", 
    type: "dropdown", 
    options: ["Document", "Consultant"]
  },
  { 
    label: "Please enter your Business Area", 
    value: "Marketing & Sales", 
    type: "dropdown", 
    options: [
      "Marketing & Sales", "Corporate Governance", "Operations Structuring", "Production",
      "Research & Design", "Distribution", "Legal and Compliance", "Finance",
      "Accounting", "IT", "Customer Relationship Management", "Human Resource Management & Talent Development",
      "Project Management", "Fundraising", "Enterprise Resource Planning", "Growth Strategy"
    ]
  },
  { 
    label: "You selected: (recap of selections) Is that correct? (Yes/No)", 
    value: "Yes", 
    type: "dropdown", 
    options: ["Yes", "No"]
  },
  { 
    label: "Question # 6", 
     value: "Please enter your business name:", type: "text"
  },

];

const Tools = () => {
  const [fields, setFields] = useState(defaultFields);

  const handleAddField = () => {
    const type = prompt("Enter 'dropdown' for dropdown field or 'text' for normal field:");
    if (!type || (type !== "text" && type !== "dropdown")) return;

    const label = prompt("Enter the label for the new field:");
    if (!label) return;

    const newField = { label, value: "", type };
    if (type === "dropdown") {
      newField.options = [prompt("Enter the first dropdown option:") || "Option 1"];
    }
    setFields([...fields, newField]);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  return (
    <>
      <Resources />
      <Script src="/assets/admin_assets/bundles/jquery-selectric/jquery.selectric.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/upload-preview/assets/js/jquery.uploadPreview.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/summernote/summernote-bs4.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js" strategy="beforeInteractive" />
      <Script src="/assets/admin_assets/js/page/create-post.js" strategy="beforeInteractive" />
      
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
                        <h4>Update AI Tokens</h4>
                      </div>
                      <div className="card-body">
                        {fields.map((field, index) => (
                          <div className="form-group row mb-4" key={index}>
                            <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                              {field.label}
                            </label>
                            <div className="col-sm-12 col-md-7">
                              {field.type === "dropdown" ? (
                                <select className="form-control" defaultValue={field.value}>
                                  {field.options.map((option, i) => (
                                    <option key={i} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                <input type="text" className="form-control" defaultValue={field.value} />
                              )}
                              <button className="btn btn-danger mt-2" onClick={() => handleRemoveField(index)}>Remove</button>
                            </div>
                          </div>
                        ))}
                        <div className="form-group row mb-4">
                          <div className="col-sm-12 col-md-7 offset-md-3">
                            <button className="btn btn-success" onClick={handleAddField}>Add Field</button>
                          </div>
                        </div>
                      </div>
                      <div className="form-group row mb-4">
                <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                  Prompt
                </label>
                <div className="col-sm-12 col-md-7">
                <textarea className="form-control" required="" defaultValue={"Based on the above, please generate a tailored business document with structured guidance and specific recommendations."}></textarea>
                </div>
              </div>
              <div className="form-group row mb-4">
                          <div className="col-sm-12 col-md-7 offset-md-3">
                            <button className="btn btn-success" onClick={handleAddField}>Update Prompt</button>
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

export default Tools;