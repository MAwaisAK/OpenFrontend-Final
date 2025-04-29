"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Script from "next/script";
import { useRouter } from "next/navigation";  // Use next/navigation instead of next/router
import "../../styles/admin_assets/css/app.min.css";
import "../../styles/admin_assets/css/components.css";

export default function ChatAppMerged() {
  const router = useRouter();  // Initialize the router from next/navigation
  // Local state for pricing details (fetched from API)
  const [pricing, setPricing] = useState(null);

  // For the Custom Bundle, we store the user-editable price and tokens.
  const [customPrice, setCustomPrice] = useState(0);
  const [customTokens, setCustomTokens] = useState(0);

  // Fetch pricing details from the API endpoint on mount
  useEffect(() => {
    async function fetchPricing() {
      try {
        // Replace with your actual endpoint path if different
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/price/small-large-custom`);
        setPricing(res.data);
      } catch (error) {
        console.error("Error fetching pricing:", error);
      }
    }
    fetchPricing();
  }, []);

  // Once we have pricing, initialize custom price/tokens
  useEffect(() => {
    if (pricing) {
      // Set the default from the DB
      setCustomPrice(pricing.custom.price);     // e.g. 0.3
      setCustomTokens(pricing.custom.tokens);   // e.g. 0
    }
  }, [pricing]);

  // Compute the ratio from the original DB data:
  // ratio = (originalPrice / originalTokens) if originalTokens != 0
  // else ratio = originalPrice if originalTokens == 0
  const ratio = useMemo(() => {
    if (!pricing) return 0;
    if (pricing.custom.tokens === 0) {
      return pricing.custom.price; // if DB tokens=0, treat ratio as price per 1 token
    }
    return pricing.custom.price / pricing.custom.tokens;
  }, [pricing]);

  // Handle user changing the price input
  const handleCustomPriceChange = (e) => {
    let newPrice = parseFloat(e.target.value) || 0;

    // Enforce a maximum price of $10
    if (newPrice >= 10) {
      newPrice = 10;
    }

    setCustomPrice(newPrice);

    // If ratio > 0, recalculate tokens = newPrice / ratio
    if (ratio > 0) {
      const newTokens = newPrice / ratio;
      setCustomTokens(newTokens);
    }
  };

  // Handle user changing the tokens input
  const handleCustomTokensChange = (e) => {
    const newTokens = parseFloat(e.target.value) || 0;
    setCustomTokens(newTokens);

    // If ratio > 0, recalculate price = newTokens * ratio
    if (ratio > 0) {
      const newPrice = newTokens * ratio;
      setCustomPrice(newPrice);
    }
  };

  // Handle Buy click and navigate to the checkout page
  const handleBuyClick = (packageType) => {
    let price = customPrice;
    let tokens = customTokens;
  
    if (packageType === "small") {
      price = pricing ? pricing.small.price : 0;
      tokens = pricing ? pricing.small.tokens : 0;
    } else if (packageType === "large") {
      price = pricing ? pricing.large.price : 0;
      tokens = pricing ? pricing.large.tokens : 0;
    }
  
    // Build the query string
    const queryParams = new URLSearchParams({
      package: packageType,
      price: price.toString(),
      tokens: tokens.toString(),
    });
  
    // Navigate to the Checkout page with query parameters
    const url = `/profile/checkout?${queryParams}`;
  
    // Use router.push with the constructed URL
    router.push(url);
  };
  
  

  return (
    <>
      <div className="main-content mt-5">
        <section className="section">
          <div className="section-body">
            <div className="row">
              {/* Small Bundle Card */}
              <div className="col-12 col-md-4 col-lg-4">
                <div className="pricing">
                  <div className="pricing-title">Small Bundle</div>
                  <div className="pricing-padding">
                    <div className="pricing-price">
                      <div>
                        ${pricing ? pricing.small.price : "Loading..."}
                      </div>
                      <div>/Worth Tokens</div>
                    </div>
                    <div className="pricing-details">
                      <div className="pricing-item">
                        <div className="pricing-item-icon">
                          <i className="fas fa-check" />
                        </div>
                        <div className="pricing-item-label">
                          {pricing ? pricing.small.tokens : "Loading..."} Tokens
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-cta">
                    <a onClick={() => handleBuyClick("small")}>
                      Buy <i className="fas fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Large Bundle Card */}
              <div className="col-12 col-md-4 col-lg-4">
                <div className="pricing pricing-highlight">
                  <div className="pricing-title">Large Bundle</div>
                  <div className="pricing-padding">
                    <div className="pricing-price">
                      <div>
                        ${pricing ? pricing.large.price : "Loading..."}
                      </div>
                      <div>/Worth Tokens</div>
                    </div>
                    <div className="pricing-details">
                      <div className="pricing-item">
                        <div className="pricing-item-icon">
                          <i className="fas fa-check" />
                        </div>
                        <div className="pricing-item-label">
                          {pricing ? pricing.large.tokens : "Loading..."} Tokens
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-cta">
                    <a onClick={() => handleBuyClick("large")}>
                      Buy <i className="fas fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Custom Bundle Card */}
              <div className="col-12 col-md-4 col-lg-4">
                <div className="pricing">
                  <div className="pricing-title">Custom Bundle</div>
                  <div className="pricing-padding">
                    <div className="pricing-price">
                      <div>
                        {/* Show the user-editable price */}
                        <label>Price ($):</label>
                        <input
                          type="number"
                          className="form-control"
                          value={customPrice}
                          onChange={handleCustomPriceChange}
                          max="10"
                        />
                      </div>
                      <div>/Worth Tokens</div>
                    </div>
                    <div className="pricing-details">
                      <div className="pricing-item">
                        <div className="pricing-item-icon">
                          <i className="fas fa-check" />
                        </div>
                        <div className="pricing-item-label">
                          <label>Tokens:</label>
                          <input
                            type="number"
                            className="form-control"
                            value={customTokens}
                            onChange={handleCustomTokensChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-cta">
                    <a onClick={() => handleBuyClick("custom")}>
                      Buy <i className="fas fa-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
              {/* End of row */}
            </div>
          </div>
        </section>
      </div>

      {/* Scripts */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/nicescroll/3.7.6/jquery.nicescroll.min.js" />
    </>
  );
}
