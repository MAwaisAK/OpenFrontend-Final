// File: /components/Login.js
"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import loginValidationSchema from "./loginvalidations"; // Adjust path as needed
// Optionally create a separate validation schema for forgot password if needed
// import forgotPasswordValidationSchema from "./forgotPasswordValidations";
import { fetchLogin, forgotPassword } from "../../app/api"; // Adjust path as needed
import { useAuth } from "@/lib/AuthContext"; // Adjust path as needed
import AdminExternalResources from "../AdminExternalResources"; // Adjust path if necessary

const Login = () => {
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");

  // Login formik instance
  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, bag) => {
      try {
        const frontendUrl = window.location.origin;
        const loginResponse = await fetchLogin({
          email: values.email,
          password: values.password,
          rememberMe: rememberMe,
          frontendUrl: frontendUrl, // Ensure it is included
        });
        // Store tokens depending on "Remember Me"
        if (rememberMe) {
          localStorage.setItem("accessToken", loginResponse.accessToken);
          localStorage.setItem("refreshToken", loginResponse.refreshToken);
        } else {
          sessionStorage.setItem("accessToken", loginResponse.accessToken);
          sessionStorage.setItem("refreshToken", loginResponse.refreshToken);
        }
        // Update auth context and redirect to profile
        login(loginResponse);
        window.location.href = "/profile";
      } catch (e) {
        bag.setErrors({ general: e.response?.data?.message || e.message });
      }
    },
  });

  // Forgot password formik instance
  const forgotFormik = useFormik({
    initialValues: { email: "" },
    // If you have a separate validation schema, include it here.
    // validationSchema: forgotPasswordValidationSchema,
    onSubmit: async (values, bag) => {
      try {
        const frontendUrl = window.location.origin;
        const response = await forgotPassword({
          email: values.email,
          frontendUrl: frontendUrl, // Ensure it is included
        });
        // You can show a success message or further instructions
        setForgotSuccess("An email has been sent with password reset instructions.");
      } catch (error) {
        bag.setErrors({ general: error.response?.data?.message || error.message });
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
                  <div className="brand-logo d-flex justify-content-center align-items-center">
                  <a href="/" className="text-primary">
                    <img src="/assets/img/logo.png" alt="logo" />
                    </a>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <h4>Hello! let's get started</h4>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <h6 className="font-weight-light">
                      {isForgotPassword ? "Forgot Password" : "Sign in to continue."}
                    </h6>
                  </div>
                  {isForgotPassword ? (
                    <form className="pt-3" onSubmit={forgotFormik.handleSubmit}>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          placeholder="Enter your email address"
                          name="email"
                          value={forgotFormik.values.email}
                          onChange={forgotFormik.handleChange}
                          onBlur={forgotFormik.handleBlur}
                        />
                      </div>
                      {forgotFormik.errors.general && (
                        <div className="alert alert-danger">
                          {forgotFormik.errors.general}
                        </div>
                      )}
                      {forgotSuccess && (
                        <div className="alert alert-success">
                          {forgotSuccess}
                        </div>
                      )}
                      <div className="mt-3 d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                        >
                          SEND RESET LINK
                        </button>
                      </div>
                      <div className="text-center mt-4 font-weight-light">
                        <a
                          className="text-primary"
                          onClick={() => setIsForgotPassword(false)}
                        >
                          Back to Sign In
                        </a>
                      </div>
                    </form>
                  ) : (
                    <form className="pt-3" onSubmit={loginFormik.handleSubmit}>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="exampleInputEmail1"
                          placeholder="Email"
                          name="email"
                          value={loginFormik.values.email}
                          onChange={loginFormik.handleChange}
                          onBlur={loginFormik.handleBlur}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="exampleInputPassword1"
                          placeholder="Password"
                          name="password"
                          value={loginFormik.values.password}
                          onChange={loginFormik.handleChange}
                          onBlur={loginFormik.handleBlur}
                        />
                      </div>
                      {loginFormik.errors.general && (
                        <div className="alert alert-danger">
                          {loginFormik.errors.general}
                        </div>
                      )}
                      <div className="mt-3 d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                        >
                          SIGN IN
                        </button>
                      </div>
                      <div className="my-2 d-flex justify-content-between align-items-center">
                        <a
                          href="#"
                          className="auth-link text-black"
                          onClick={() => setIsForgotPassword(true)}
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="text-center mt-4 font-weight-light">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-primary">
                          Create
                        </a>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* content-wrapper ends */}
        </div>
        {/* page-body-wrapper ends */}
      </div>
      {/* container-scroller */}
    </>
  );
};

export default Login;
