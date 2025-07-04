"use client";

import React, { useState,useRef } from "react";
import { useFormik } from "formik";
import AdminExternalResources from "../AdminExternalResources";
import countries from "world-countries";
import validationSchema from "./validations"; // Ensure it validates password confirmation
import { fetcRegister } from "../../app/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import 'bootstrap/dist/js/bootstrap.bundle.min'; // ensure bootstrap JS is loaded

const Signup = () => {
  const countryList = countries.map((country) => ({
    name: country.name.common,
    code: country.cca2,
  }));
  const router = useRouter();
  const successToastRef = useRef(null);
  const errorToastRef = useRef(null);
  const showToast = (ref) => {
  const toast = new bootstrap.Toast(ref.current);
  toast.show();
  };


  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  // Add this to your component state
  const [agreeToTerms, setAgreeToTerms] = useState(false);


  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  const frontendUrl = window.location.origin;
  const formikSignup = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      country: "",
      frontendUrl: frontendUrl, // Ensure it is included
    },
    validationSchema,
    onSubmit: async (values, bag) => {
      try {
        await fetcRegister(values);
        successToastRef.current.querySelector(".toast-body").innerText = "Registration successful! Check your email to verify your account.";
        showToast(successToastRef);
        bag.resetForm();
        setTimeout(() => {
        router.push("/login"); // ✅ Now this will work
        }, 3000);
      } catch (error) {
    const msg = error.response?.data?.message || error.message;
    const status = error.response?.status;

    // If it's a 409 conflict on username:
    if (status === 409 && msg.toLowerCase().includes("username")) {
      bag.setFieldError("username", msg);
    }
    // You could also detect email conflicts similarly:
    else if (status === 409 && msg.toLowerCase().includes("e-mail")) {
      bag.setFieldError("email", msg);
    }
    // Otherwise show a general error banner:
    else {
      bag.setErrors({ general: msg });
    }
  }
    },
  });

  return (
    <>
      <AdminExternalResources />
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-4 mx-auto">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  <div className="brand-logo text-center">
                  <a href="/" className="text-primary">
                    <img src="/assets/img/logo.png" alt="logo" />
                    </a>
                  </div>
                  <h4 className="text-center">New here?</h4>
                  <h6 className="font-weight-light text-center">Sign up in a few steps.</h6>

                  <form className="pt-3" onSubmit={formikSignup.handleSubmit}>
                     {formikSignup.errors.general && (
    <div className="alert alert-danger">
      {formikSignup.errors.general}
    </div>
  )}
                    {/* First Name */}
                    <div className="form-group">
                      <input
                        type="text"
                        name="firstName"
                        className="form-control form-control-lg"
                        placeholder="First Name"
                        {...formikSignup.getFieldProps("firstName")}
                      />
                      {formikSignup.touched.firstName && formikSignup.errors.firstName && (
                        <div className="alert alert-danger">{formikSignup.errors.firstName}</div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="form-group">
                      <input
                        type="text"
                        name="lastName"
                        className="form-control form-control-lg"
                        placeholder="Last Name"
                        {...formikSignup.getFieldProps("lastName")}
                      />
                      {formikSignup.touched.lastName && formikSignup.errors.lastName && (
                        <div className="alert alert-danger">{formikSignup.errors.lastName}</div>
                      )}
                    </div>

                    {/* Username */}
                   <div className="form-group">
    <input
      type="text"
      name="username"
      className="form-control form-control-lg"
      placeholder="Username"
      {...formikSignup.getFieldProps("username")}
    />
    {formikSignup.touched.username && formikSignup.errors.username && (
      <div className="alert alert-danger">
        {formikSignup.errors.username}
      </div>
    )}
  </div>

                    {/* Email */}
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg"
                        placeholder="Email"
                        {...formikSignup.getFieldProps("email")}
                      />
                      {formikSignup.touched.email && formikSignup.errors.email && (
                        <div className="alert alert-danger">{formikSignup.errors.email}</div>
                      )}
                    </div>

                    {/* Country Select */}
                    <div className="form-group">
                      <select
                        name="country"
                        className="form-select form-select-lg"
                        {...formikSignup.getFieldProps("country")}
                      >
                        <option value="">Select Country</option>
                        {countryList.map((country, index) => (
                          <option key={index} value={country.name}>{country.name}</option>
                        ))}
                      </select>
                      {formikSignup.touched.country && formikSignup.errors.country && (
                        <div className="alert alert-danger">{formikSignup.errors.country}</div>
                      )}
                    </div>

                    {/* Password */}
                    <div className="form-group" style={{ position: "relative" }}>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        {...formikSignup.getFieldProps("password")}
                      />
                      <i
                        className={`fas ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
                        style={{ position: "absolute", right: "10px", top: "35%", cursor: "pointer" }}
                        onClick={togglePasswordVisibility}
                      ></i>
                      {formikSignup.touched.password && formikSignup.errors.password && (
                        <div className="alert alert-danger">{formikSignup.errors.password}</div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group" style={{ position: "relative" }}>
                      <input
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        name="passwordConfirm"
                        className="form-control form-control-lg"
                        placeholder="Confirm Password"
                        {...formikSignup.getFieldProps("passwordConfirm")}
                      />
                      <i
                        className={`fas ${isConfirmPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
                        style={{ position: "absolute", right: "10px", top: "35%", cursor: "pointer" }}
                        onClick={toggleConfirmPasswordVisibility}
                      ></i>
                      {formikSignup.touched.passwordConfirm && formikSignup.errors.passwordConfirm && (
                        <div className="alert alert-danger">{formikSignup.errors.passwordConfirm}</div>
                      )}
                       <div className="m-3">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          id="terms"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          style={{ width: "1.2em", height: "1.2em" }}
                        />
                        <label 
                          style={{ marginTop:"1px"}}>
                          I agree to the{" "}
                          <Link href="/terms-conditions">
                            <span className="text-primary text-decoration-underline">Terms and Conditions</span>
                          </Link>
                        </label>
                      </div>
                    </div>              
                    <button type="submit" className="btn btn-primary btn-lg w-100"  disabled={!agreeToTerms}>Sign Up</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

    </>
  );
};

export default Signup;
