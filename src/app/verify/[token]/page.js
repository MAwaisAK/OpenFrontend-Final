"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminExternalResources from "../../../components/AdminExternalResources";
import { useRouter, useParams } from "next/navigation";
import { verifyEmail } from "../../api"; // Adjust the path

export default function Verify() {
  const params = useParams();
  const token = params.token;
  const [message, setMessage] = useState("Verifying your email...");
  const [verificationSuccessful, setVerificationSuccessful] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setMessage("No verification token provided.");
        setVerificationSuccessful(false);
        return;
      }

      try {
        const response = await verifyEmail(token);

        // Ensure you're checking for 'success' in the response
        if (response.success) {
          setMessage(response.message || "Your email has been successfully verified!");
          setVerificationSuccessful(true);
        } else {
          setMessage("Verification failed. The link may be invalid or expired.");
          setVerificationSuccessful(false);
        }
      } catch (error) {
        setMessage("Verified");
        setVerificationSuccessful(false);
      }
    };

    verifyUserEmail();
  }, [token]);

  return (
    <>
      <AdminExternalResources />
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-4 mx-auto">
                <div className="auth-form-light text-center py-5 px-4 px-sm-5">
                  <div className="brand-logo">
                    <img src="/assets/img/logo.png" alt="logo" />
                  </div>
                  <h4>{verificationSuccessful ? "Verification Successful" : "Verification Failed"}</h4>
                  <p className={`text-${verificationSuccessful ? "success" : "danger"}`}>{message}</p>

                  <Link href="/login">
                    <button className="btn btn-primary btn-lg w-100">
                      Back to Sign In
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
