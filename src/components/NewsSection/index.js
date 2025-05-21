// components/NewsCarousel.jsx
"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { fetchAllNews } from "@/app/api";
import Script from "next/script";

const NewsCarousel = () => {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { news } = await fetchAllNews();
        if (news?.length) {
          const doc = news[0];
          const items = (doc.title || []).map((headline, idx) => ({
            image:       doc.img?.[idx] || "",
            title:       headline,
            description: doc.content?.[idx] || "",
            url:         doc.link?.[idx] || ""
          }));
          setNewsItems(items);
        }
      } catch (e) {
        console.error("Error loading news:", e);
      }
    })();
  }, []);

  // Trigger AdSense to load the ad block after component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Adsense error:", e);
      }
    }
  }, []);

  const settings = {
    infinite:       true,
    speed:          500,
    slidesToShow:   1,
    slidesToScroll: 1,
    autoplay:       true,
    autoplaySpeed:  3000,
    arrows:         true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 600,  settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      {/* AdSense ad above the carousel */}


      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "320px", height: "100px", margin: "0 auto" }}
          data-ad-client="ca-pub-4469304838128644"
          data-ad-slot="1234567890"  // Replace with your actual ad unit ID
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>

      {/* News carousel */}
      <Slider {...settings}>
        {newsItems.map((item, i) => (
          <div key={i} style={{ padding: "10px" }}>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="carousel-img"
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }}
              />
            )}
            <h3 style={{ fontSize: "1.1rem", margin: "10px 5px 5px" }}>
              {item.title}
            </h3>
            <p style={{
              fontSize: "0.9rem",
              color: "#555",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              margin: "10px 5px 5px"
            }}>
              {item.description}
            </p>
            {item.url && (
              <span
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  color: "#42b1fa",
                  marginLeft: "5px",
                }}
                onClick={() => window.open(item.url, "_blank")}
              >
                Read More
              </span>
            )}
          </div>
        ))}
      </Slider>
    </>
  );
};

export default NewsCarousel;
