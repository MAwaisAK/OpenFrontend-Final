"use client";
import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { fetchMe, fetchBasicPremiumPricing } from "@/app/api";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "../../styles/checkout.css";
import Sidebar from "../AdminSideBar";
import Navbar from "../Nav";
import 'bootstrap/dist/js/bootstrap.bundle.min'; // ensure bootstrap JS is loaded

const PaymentCard = () => {
  const stripe = useStripe();
  const elements = useElements();
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get("package") || "basic";
  const queryPrice = parseFloat(searchParams.get("price")) || 0;
  const courseId = searchParams.get("id") || "";
  


  // For course purchase the price comes from query params.
  const [packageType, setPackageType] = useState(initialPackage);
  const [price, setPrice] = useState(initialPackage === "course" ? queryPrice : 0);
  const [period, setPeriod] = useState("month"); // used only if not course
  const [userData, setUserData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const successToastRef = useRef(null);

const showToast = (ref) => {
const toast = new bootstrap.Toast(ref.current);
toast.show();
};


  // Fetch user data on mount.
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await fetchMe();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

    // For basic/premium packages, fetch pricing from your API.
    useEffect(() => {
      const courseLikePackages = ["course", "small", "large", "custom"];
      
      if (courseLikePackages.includes(packageType)) {
        setPrice(queryPrice);
      } else {
        const updatePricing = async (pkgType, selectedPeriod) => {
          try {
            const pricingData = await fetchBasicPremiumPricing();
            if (pkgType === "basic") {
              const selectedPrice =
                selectedPeriod === "year"
                  ? pricingData.basic.perYear.price
                  : pricingData.basic.perMonth.price;
              setPrice(selectedPrice);
            } else if (pkgType === "premium") {
              const selectedPrice =
                selectedPeriod === "year"
                  ? pricingData.premium.perYear.price
                  : pricingData.premium.perMonth.price;
              setPrice(selectedPrice);
            }
          } catch (error) {
            console.error("Error fetching pricing:", error);
          }
        };
    
        updatePricing(packageType, period);
      }
    }, [packageType, period, queryPrice]);
    

  // Handler for billing period change (only for basic/premium).
  const handlePeriodChange = (e) => {
    const selectedPeriod = e.target.value;
    setPeriod(selectedPeriod);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // Create payment method using Stripe.
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (pmError) {
      setPaymentStatus(pmError.message);
      return;
    }

    try {
      const amountInCents = Math.round(price * 100);
      // Post to your backend to create a payment intent.
      // For course purchase, we also send courseId.
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/payment/create-payment-intent`,
        {
          amount: amountInCents,
          packageType,
          period: packageType === "basic" || packageType === "premium" ? period : undefined,
          paymentMethodId: paymentMethod.id,
          userId: userData?._id,
          price,
          courseId: packageType === "course" ? courseId : undefined,
          // tokens are used only for other packages.
          tokens: packageType === "basic" || packageType === "premium" ? 0 : undefined,
        }
      );

      const { clientSecret } = response.data;
      // Confirm card payment using the client secret from the backend.
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        setPaymentStatus(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        setConfirmed(true);
        setPaymentStatus("Payment successful!");
      }
    } catch (error) {
      setPaymentStatus("Error processing payment.");
      console.error("Payment error:", error);
    }
  };

  // Redirect on payment confirmation.
  useEffect(() => {
    if (confirmed) {
      alert("Payment Successful!");
      successToastRef.current.querySelector(".toast-body").innerText = "Payment Successful!";
showToast(successToastRef);
      window.location.href = "/profile";
    }
  }, [confirmed]);

  return (
    <>
      {/*<Navbar />*/}
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="check-container">
            {/* For basic/premium package, show period selectors */}
            {(packageType === "basic" || packageType === "premium") && (
              <div className="check-period-selector" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1rem" }}>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
                  <label htmlFor="month" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="radio"
                      id="month"
                      name="billingPeriod"
                      value="month"
                      checked={period === "month"}
                      onChange={handlePeriodChange}
                    />
                    Monthly
                  </label>
                  <label htmlFor="year" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="radio"
                      id="year"
                      name="billingPeriod"
                      value="year"
                      checked={period === "year"}
                      onChange={handlePeriodChange}
                    />
                    Yearly
                  </label>
                </div>
              </div>
            )}

            <form className="check-card" onSubmit={handleSubmit}>
              <label style={{ color: "white" }}>Card number:</label>
              <div className="check-input check-cardnumber">
                <CardElement
                  options={{
                    style: { base: { fontSize: "16px", color: "#fff" } },
                    hidePostalCode: true
                  }}
                />
              </div>
              <button className="check-proceed" type="submit">
                <svg className="check-sendicon" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
                </svg>
              </button>
            </form>
            
            <div className="check-receipt">
              <div className="check-col">
                <p>Cost:</p>
                <h2 className="check-cost">${price}</h2>
                <br />
              </div>
              <div className="check-col">
                <p>Package Type:</p>
                <h3 className="check-bought-items">
    {packageType.charAt(0).toUpperCase() + packageType.slice(1)}
  </h3>
                {packageType !== "basic" && packageType !== "premium" && packageType !== "course" && (
                  <p className="check-bought-items check-price">
                    <b>Tokens:</b> {searchParams.get("tokens")}
                  </p>
                )}
                <br />
              </div>
             {/* … inside your .check-receipt div, right before the <p className="check-comprobe"> … */}
{packageType === "course" && (
  <p className="check-bought-items check-discount">
    {userData?.subscription === "premium"
      ? "100% off 🎉"
      : userData?.subscription === "basic"
      ? "80% off"
      : "No discount available"}
  </p>
)}

<p className="check-comprobe">...</p>

              {paymentStatus && <p className="check-payment-status">{paymentStatus}</p>}
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

// Stripe Wrapper
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
const PaymentCardWrapper = () => (
  <Elements stripe={stripePromise}>
    <PaymentCard />
  </Elements>
);

export default PaymentCardWrapper;
