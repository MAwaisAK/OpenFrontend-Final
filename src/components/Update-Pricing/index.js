"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Admin_Sidebar";
import Navbar from "../Admin_Nav";
import Resources from "../Admin_Scripts";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { fetchMe } from "@/app/api";
import "../../styles/admin_assets/css/app.min.css";
import "../../styles/admin_assets/css/components.css";
import "../../styles/admin_assets/bundles/summernote/summernote-bs4.css";
import "../../styles/admin_assets/bundles/bootstrap-tagsinput/dist/bootstrap-tagsinput.css";

export default function PriceEditor() {

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
      if (me && (me.level !== "super" && me.level !== "finance")) {
        router.push("/admin/opulententrepreneurs/open/dashboard");
      } else {
        setLoading2(false); // Only allow render when authorized
      }
    }
  }, [me, loading3]);

  const isSuperAdmin = me?.level === "super" || "finance";
  // State for the Price document
  const [priceData, setPriceData] = useState({
    small: { price: 0.0, tokens: 0.0 },
    large: { price: 0.0, tokens: 0.0 },
    custom: { price: 1.2, tokens: 1 },
    basic: {
      perMonth: { price: 0.0, tokens: 0.0 },
      perYear: { price: 0.0, tokens: 0.0 },
    },
    premium: {
      perMonth: { price: 0.0, tokens: 0.0 },
      perYear: { price: 0.0, tokens: 0.0 },
    },
    Characterpertoken: 4,
    FinalDiscount: 0.5,
  });

  // Fetch the Price document on mount
  useEffect(() => {
    async function fetchPriceDoc() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/price`);
        setPriceData(res.data);
      } catch (error) {
        console.error("Error fetching price data:", error);
      }
    }
    fetchPriceDoc();
  }, []);

  // Handle input changes.
  // section: "small", "large", "custom", "basic", "premium"
  // field: for non-nested (e.g., "price" or "tokens") or for nested objects (e.g., "perMonth" or "perYear")
  // subfield: if nested (price or tokens inside basic/perMonth etc.)
  const handleInputChange = (section, field, subfield, e) => {
    const newValue = parseFloat(e.target.value) || 0;
    setPriceData((prev) => {
      const updated = { ...prev };
      if (field && subfield !== undefined) {
        updated[section][field][subfield] = newValue;
      } else if (field) {
        updated[section][field] = newValue;
      } else {
        updated[section] = newValue; // ← For fields like Characterpertoken, FinalDiscount
      }
      return updated;
    });
  };


  // Handle update on blur for each input field.
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/price`, priceData);
      setPriceData(res.data);
      // Optionally display a success message, e.g., via toast or alert:
      // alert("Pricing updated successfully!");
    } catch (error) {
      console.error("Error updating pricing:", error);
      // Optionally display error notification:
      // alert("Failed to update pricing.");
    }
  };

  if (loading2) {
    return <div className="p-4">Loading...</div>;
  }

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
                        <h4>Update Pricing</h4>
                      </div>
                      <div className="card-body">
                        <h5 className="mb-4 mt-5 font-weight-bold">Token Bundles</h5>

                        {/* Small Bundle */}
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Small Bundle Price
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.small.price}
                              onChange={(e) => handleInputChange("small", "price", null, e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Small Bundle Tokens
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.small.tokens}
                              onChange={(e) => handleInputChange("small", "tokens", null, e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        {/* Large Bundle */}
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Large Bundle Price
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.large.price}
                              onChange={(e) => handleInputChange("large", "price", null, e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Large Bundle Tokens
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.large.tokens}
                              onChange={(e) => handleInputChange("large", "tokens", null, e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        {/* Custom Bundle */}
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Custom Bundle Price
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.custom.price}
                              onChange={(e) => handleInputChange("custom", "price", null, e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Custom Bundle Tokens
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.custom.tokens}
                              onChange={(e) => handleInputChange("custom", "tokens", null, e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <h5 className="mb-4 mt-5 font-weight-bold">Subscription Month Basic Plans</h5>

                        {/* Basic - Per Month */}
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Basic Per Month Price
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.basic.perMonth.price}
                              onChange={(e) => handleInputChange("basic", "perMonth", "price", e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Basic Per Month Tokens
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.basic.perMonth.tokens}
                              onChange={(e) => handleInputChange("basic", "perMonth", "tokens", e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <h5 className="mb-4 mt-5 font-weight-bold">Subscription Year Basic Plans</h5>
                        {/* Basic - Per Year */}
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Basic Per Year Price
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.basic.perYear.price}
                              onChange={(e) => handleInputChange("basic", "perYear", "price", e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Basic Per Year Tokens
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.basic.perYear.tokens}
                              onChange={(e) => handleInputChange("basic", "perYear", "tokens", e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        {/* Premium - Per Month */}
                        <h5 className="mb-4 mt-5 font-weight-bold">Subscription Month Premium Plans</h5>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Premium Per Month Price
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.premium.perMonth.price}
                              onChange={(e) => handleInputChange("premium", "perMonth", "price", e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Premium Per Month Tokens
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.premium.perMonth.tokens}
                              onChange={(e) => handleInputChange("premium", "perMonth", "tokens", e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <h5 className="mb-4 mt-5 font-weight-bold">Subscription Year Premium Plans</h5>
                        {/* Premium - Per Year */}
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Premium Per Year Price
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.premium.perYear.price}
                              onChange={(e) => handleInputChange("premium", "perYear", "price", e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Premium Per Year Tokens
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="0.01"
                              className="form-control"
                              value={priceData.premium.perYear.tokens}
                              onChange={(e) => handleInputChange("premium", "perYear", "tokens", e)}
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <h5 className="mb-4 mt-5 font-weight-bold">Lift-Ai</h5>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Character per Token
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="1"
                              className="form-control"
                              value={priceData.Characterpertoken}
                              onChange={(e) => handleInputChange("Characterpertoken", 0, 0, e)}

                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        <div className="form-group row mb-4">
                          <label className="col-form-label text-md-right col-12 col-md-3 col-lg-3">
                            Discount Lift-Ai
                          </label>
                          <div className="col-sm-12 col-md-7">
                            <input
                              type="number"
                              step="1"
                              className="form-control"
                              value={priceData.FinalDiscount}
                              onChange={(e) => handleInputChange("FinalDiscount", 0, 0, e)}
                              max="100"
                              onBlur={handleUpdate}
                              disabled={!isSuperAdmin}
                            />
                          </div>
                        </div>
                        {/* Final update button (optional) */}
                        <div className="form-group row mb-4">
                          <div className="col-sm-12 col-md-7 offset-md-3">
                            <button className="btn btn-success" onClick={handleUpdate}>
                              Update Pricing
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> </section>
          </div>

        </div>
      </div>
    </>
  );
}
