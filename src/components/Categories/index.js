"use client";
import { useState, useEffect } from "react";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import { useRouter } from "next/navigation";
import {
  fetchCoursesArray,
  fetchSupportArray,
  fetchToolsArray,
  createOrUpdateCategory,
  deleteCategoryItem,
  fetchMe
} from "@/app/api"; // Import new API functions

import "../../styles/admin_assets/bundles/summernote/summernote-bs4.css";
import "../../styles/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.css";
import Script from "next/script";

const Tools = () => {
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
  const [categories, setCategories] = useState({
    courses: [],
    support: [],
    tools: [],
  });

  const [newCategory, setNewCategory] = useState("");
  const [selectedType, setSelectedType] = useState("courses");
  const [isAdding, setIsAdding] = useState(false);

  // Fetch initial categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const courses = await fetchCoursesArray();
        const support = await fetchSupportArray();
        const tools = await fetchToolsArray();

        setCategories({
          courses: courses.data || [],
          support: support.data || [],
          tools: tools.data || [],
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle add button click (switch to input mode)
  const handleAddClick = (type) => {
    setSelectedType(type);
    setIsAdding(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  // Submit new category to the database
  const handleAddCategory = async () => {
    if (!newCategory) return;

    try {
      await createOrUpdateCategory({ arrayName: selectedType, value: newCategory });

      setCategories((prev) => ({
        ...prev,
        [selectedType]: [...prev[selectedType], newCategory],
      }));
      setNewCategory("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Remove category from the database
  const handleRemoveCategory = async (type, value) => {
    try {
      await deleteCategoryItem(type, value);

      setCategories((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
    } catch (error) {
      console.error("Error removing category:", error);
    }
  };

  if (loading2) {
    return <div className="p-4">Loading...</div>;
  }

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
                        <h4>Manage Categories</h4>
                      </div>
                      <div className="card-body">
                        {/* Courses Section */}
                        <CategorySection
                          title="Courses"
                          type="courses"
                          items={categories.courses}
                          isAdding={isAdding && selectedType === "courses"}
                          onAddClick={() => handleAddClick("courses")}
                          onRemoveClick={handleRemoveCategory}
                          newCategory={newCategory}
                          onInputChange={handleInputChange}
                          onSubmit={handleAddCategory}
                        />

                        {/* Support Section */}
                        <CategorySection
                          title="Support"
                          type="support"
                          items={categories.support}
                          isAdding={isAdding && selectedType === "support"}
                          onAddClick={() => handleAddClick("support")}
                          onRemoveClick={handleRemoveCategory}
                          newCategory={newCategory}
                          onInputChange={handleInputChange}
                          onSubmit={handleAddCategory}
                        />

                        {/* Tools Section */}
                        <CategorySection
                          title="Tools"
                          type="tools"
                          items={categories.tools}
                          isAdding={isAdding && selectedType === "tools"}
                          onAddClick={() => handleAddClick("tools")}
                          onRemoveClick={handleRemoveCategory}
                          newCategory={newCategory}
                          onInputChange={handleInputChange}
                          onSubmit={handleAddCategory}
                        />
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

// Category Section Component
const CategorySection = ({
  title,
  type,
  items,
  isAdding,
  onAddClick,
  onRemoveClick,
  newCategory,
  onInputChange,
  onSubmit,
}) => {
  // Local state to hold the selected item for removal
  const [selectedItem, setSelectedItem] = useState(items && items.length > 0 ? items[0] : "");

  useEffect(() => {
    // When the items change, update the selected item if needed.
    if (items.length > 0) {
      setSelectedItem(items[0]);
    } else {
      setSelectedItem("");
    }
  }, [items]);

  return (
    <div className="form-group row mb-4">
      <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">{title}</label>
      <div className="col-sm-12 col-md-7">
        {isAdding ? (
          <input
            type="text"
            className="form-control"
            value={newCategory}
            onChange={onInputChange}
            placeholder={`Enter new ${title.toLowerCase()}`}
          />
        ) : (
          <select
            className="form-control selectric"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            {items.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="col-sm-12 col-md-2">
        {isAdding ? (
          <button className="btn btn-primary" onClick={onSubmit}>
            Save
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => onAddClick(type)}>
            Add
          </button>
        )}
        <button className="btn btn-danger ml-2" onClick={() => onRemoveClick(type, selectedItem)}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default Tools;
