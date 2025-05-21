"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Admin_Sidebar";
import { useRouter } from "next/navigation";
import Navbar from "../Admin_Nav";
import { fetchMe } from "@/app/api";
import Resources from "../Admin_Scripts";
import "../../styles/admin_assets/css/app.min.css";
import "../../styles/admin_assets/css/components.css";

export default function TestimonialManager() {

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
      if (me && (me.level !== "super" && me.level !== "community")) {
        router.push("/admin/opulententrepreneurs/open/dashboard");
      } else {
        setLoading2(false); // Only allow render when authorized
      }
    }
  }, [me, loading3]);
  // State for testimonials
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    message: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null); // Track editing state

  // Fetch testimonials on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/get-all`
      );
      setTestimonials(res.data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewTestimonial({ ...newTestimonial, image: file });
    setPreview(URL.createObjectURL(file));
  };

  // Handle text input change
  const handleInputChange = (e) => {
    setNewTestimonial({ ...newTestimonial, [e.target.name]: e.target.value });
  };

  // Add a new testimonial
  const addTestimonial = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newTestimonial.name);
      formData.append("testimonal", newTestimonial.message);
      formData.append("img", newTestimonial.image); // Field name must match

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setTestimonials([...testimonials, res.data]);
      resetForm();
      alert("Testimonial added successfully.");
    } catch (error) {
      console.error("Error adding testimonial:", error);
      alert("Failed to add testimonial.");
    }
  };

  // Set testimonial data in form for updating
  const editTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setNewTestimonial({
      name: testimonial.name,
      message: testimonial.testimonal,
      image: null, // Reset image to prevent overriding unless a new one is uploaded
    });
    setPreview(testimonial.img);
  };

  // Update a testimonial
  const updateTestimonial = async () => {
    try {
      if (!editingTestimonial) return;

      const formData = new FormData();
      formData.append("name", newTestimonial.name);
      formData.append("testimonal", newTestimonial.message);

      // Only append a new image if the user uploaded one
      if (newTestimonial.image) {
        formData.append("img", newTestimonial.image);
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/update/${editingTestimonial._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setTestimonials(testimonials.map(t =>
        t._id === editingTestimonial._id ? res.data : t
      ));

      resetForm();
      alert("Testimonial updated successfully.");
    } catch (error) {
      console.error("Error updating testimonial:", error);
      alert("Failed to update testimonial.");
    }
  };

  // Delete a testimonial
  const deleteTestimonial = async (id) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/testimonals/delete/${id}`
      );
      setTestimonials(testimonials.filter((t) => t._id !== id));
      alert("Testimonial deleted.");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial.");
    }
  };

  // Reset form state
  const resetForm = () => {
    setNewTestimonial({ name: "", message: "", image: null });
    setPreview(null);
    setEditingTestimonial(null);
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
                <h2 className="section-title">Manage Testimonials</h2>

                {/* Add or Update Testimonial Form */}
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h4>{editingTestimonial ? "Update" : "Add"} Testimonial</h4>
                      </div>
                      <div className="card-body">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={newTestimonial.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Message</label>
                          <textarea
                            className="form-control"
                            name="message"
                            rows="3"
                            value={newTestimonial.message}
                            onChange={handleInputChange}
                            required
                          ></textarea>
                        </div>

                        <div className="form-group">
                          <label>Upload Image</label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                          {preview && (
                            <img
                              src={preview}
                              alt="Preview"
                              style={{ width: "150px", marginTop: "10px" }}
                            />
                          )}
                        </div>

                        <button
                          className={`btn ${editingTestimonial ? "btn-success" : "btn-primary"}`}
                          onClick={editingTestimonial ? updateTestimonial : addTestimonial}
                        >
                          {editingTestimonial ? "Update Testimonial" : "Add Testimonial"}
                        </button>

                        {editingTestimonial && (
                          <button className="btn btn-secondary ml-2" onClick={resetForm}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display Testimonials */}
                <div className="row">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="col-md-4">
                      <div className="card">
                        <div className="card-body text-center">
                          {testimonial.img && (
                            <img
                              src={testimonial.img}
                              alt={testimonial.name}
                              style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <h5 className="mt-3">{testimonial.name}</h5>
                          <p>"{testimonial.testimonal}"</p>
                          <button
                            className="btn btn-warning mr-2"
                            onClick={() => editTestimonial(testimonial)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteTestimonial(testimonial._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* End of Testimonials Section */}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
