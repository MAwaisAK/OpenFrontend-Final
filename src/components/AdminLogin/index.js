// File: /components/Login.js
"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import loginValidationSchema from "./loginvalidations"; // adjust path
import { loginAdmin } from "../../app/api";            // your admin login API
import { useAuth } from "@/lib/AuthContext";           // your auth context
import AdminExternalResources from "../AdminExternalResources";

const Login = () => {
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, bag) => {
      try {
        const loginResponse = await loginAdmin({
          username: values.username,
          password: values.password,
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
        window.location.href = "/admin/opulententrepreneurs/open/dashboard";
      } catch (e) {
        bag.setErrors({ general: e.response?.data?.message || e.message });
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
                  <div className="brand-logo d-flex justify-content-center">
                    <a href="/" className="text-primary">
                      <img src="/assets/img/logo.png" alt="logo" />
                    </a>
                  </div>
                  <h4 className="text-center mb-4">Admin Sign In</h4>

                  <form className="pt-3" onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.username && formik.errors.username && (
                        <div className="text-danger small">
                          {formik.errors.username}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="text-danger small">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>

                    {formik.errors.general && (
                      <div className="alert alert-danger">
                        {formik.errors.general}
                      </div>
                    )}

                    <div className="mt-3 d-grid">
                      <button
                        type="submit"
                        className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      >
                        SIGN IN
                      </button>
                    </div>

                    <div className="text-center mt-4 font-weight-light">
                      <a href="/" className="text-primary">
                        Back to site
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* content-wrapper */}
        </div>
        {/* page-body-wrapper */}
      </div>
      {/* container-scroller */}
    </>
  );
};

export default Login;
