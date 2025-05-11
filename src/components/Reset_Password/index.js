"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { resetPassword } from "../../app/api"; // Adjust path as needed
import AdminExternalResources from "../AdminExternalResources";
import { useRouter, useParams } from "next/navigation";

const ResetPassword = () => {
   const params = useParams();
  const router = useRouter();
  const token = params.token;
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const frontendUrl = window.location.origin; // Gets the frontend URL dynamically

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      frontend:frontendUrl,
    },
    // validationSchema: resetPasswordValidationSchema, // Uncomment if you have a schema
    onSubmit: async (values, bag) => {
      setSuccessMessage("");
      setErrorMessage("");

      try {
        await resetPassword(token, values.newPassword, values.confirmPassword,values.frontend);
        setSuccessMessage("Your password has been reset successfully! Redirecting...");
        setTimeout(() => {
          router.push("/login"); // Redirect after success
        }, 3000);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
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
                    <img src="/assets/img/logo.png" alt="logo" />
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <h4>Reset Your Password</h4>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <h6 className="font-weight-light">Enter your new password below.</h6>
                  </div>

                  {successMessage && (
                    <div className="alert alert-success text-center">{successMessage}</div>
                  )}

                  {errorMessage && (
                    <div className="alert alert-danger text-center">{errorMessage}</div>
                  )}

                  <form className="pt-3" onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="New Password"
                        name="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="mt-3 d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? "Resetting..." : "RESET PASSWORD"}
                      </button>
                    </div>
                  </form>
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

export default ResetPassword;
