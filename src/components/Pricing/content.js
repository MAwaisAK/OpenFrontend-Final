"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Script from "next/script";
import { useRouter } from "next/navigation";  // Use next/navigation instead of next/router
import "../../styles/admin_assets/css/app.min.css";
import "../../styles/admin_assets/css/components.css";

export default function ChatAppMerged() {
  const router = useRouter();
  // Local state for pricing details (fetched from API)
  const [pricing, setPricing] = useState(null);

  // For the Custom Bundle, start both price and tokens at 0
  const [customPrice, setCustomPrice] = useState(0);
  const [customTokens, setCustomTokens] = useState(0);

  // Fetch pricing details from the API endpoint on mount
  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_ENDPOINT}/price/small-large-custom`
        );
        setPricing(res.data);
      } catch (error) {
        console.error("Error fetching pricing:", error);
      }
    }
    fetchPricing();
  }, []);

  // Compute the ratio from the original DB data:
  // ratio = (originalPrice / originalTokens) if originalTokens != 0
  // else ratio = originalPrice if originalTokens == 0
  const ratio = useMemo(() => {
    if (!pricing) return 0;
    if (pricing.custom.tokens === 0) {
      // if DB tokens = 0, treat ratio as price per 1 token
      return pricing.custom.price;
    }
    return pricing.custom.price / pricing.custom.tokens;
  }, [pricing]);

  // Handle user changing the price input
  const handleCustomPriceChange = (e) => {
    let input = e.target.value;

    // Strip leading zeros such as "05" → "5", but allow "0" or decimals like "0.5"
    if (/^0[1-9]/.test(input)) {
      input = input.replace(/^0+/, "");
    }

    let newPrice = parseFloat(input) || 0;

    // Enforce a maximum price of $10
    if (newPrice > 10) {
      newPrice = 10;
    }

    setCustomPrice(newPrice);

    // Recalculate tokens if ratio is valid
    if (ratio > 0) {
      let newTokens = newPrice / ratio;

      // Also cap tokens so that price never exceeds $10
      if (newTokens * ratio > 10) {
        newTokens = 10 / ratio;
      }

      setCustomTokens(newTokens);
    }
  };

  // Handle user changing the tokens input
  const handleCustomTokensChange = (e) => {
    let newTokens = parseFloat(e.target.value) || 0;

    // If ratio valid, compute corresponding price
    if (ratio > 0) {
      let newPrice = newTokens * ratio;

      // Cap price at $10
      if (newPrice > 10) {
        newPrice = 10;
        newTokens = 10 / ratio;
      }

      setCustomPrice(newPrice);
      setCustomTokens(newTokens);
    } else {
      setCustomTokens(newTokens);
    }
  };

  // Handle Buy click and navigate to the checkout page
  const handleBuyClick = (packageType) => {
    let price, tokens;

    if (packageType === "small") {
      price = pricing?.small.price ?? 0;
      tokens = pricing?.small.tokens ?? 0;
    } else if (packageType === "large") {
      price = pricing?.large.price ?? 0;
      tokens = pricing?.large.tokens ?? 0;
    } else {
      price = customPrice;
      tokens = customTokens;
    }

    const queryParams = new URLSearchParams({
      package: packageType,
      price: price.toString(),
      tokens: tokens.toString(),
    });

    router.push(`/profile/checkout?${queryParams}`);
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
                      <div>${pricing ? pricing.small.price : "Loading..."}</div>
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
                      <div>${pricing ? pricing.large.price : "Loading..."}</div>
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
                        <label>Price ($):</label>
                        <input
                          type="number"
                          className="form-control"
                          value={customPrice}
                          onChange={handleCustomPriceChange}
                          onFocus={(e) => e.target.select()}
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
                            onFocus={(e) => e.target.select()}
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
