"use client";
import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import Features from "@/components/Features";
import Link from "next/link";
import Testimonials from "@/components/Testimonals";
import { fetchLandingImages, fetchBasicPremiumPricing,fetchDashboardStats } from "@/app/api";
import { useAuth } from "@/lib/AuthContext";

// Updated Counter component using Intersection Observer
const Counter = ({ start = 0, end, duration = 1 }) => {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            observer.unobserve(counterRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) observer.observe(counterRef.current);
    return () => {
      if (counterRef.current) observer.unobserve(counterRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    const totalTime = duration * 1000;
    const stepTime = 50;
    const steps = totalTime / stepTime;
    const increment = (end - start) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setCount((prev) => {
        const next = prev + increment;
        return next >= end ? end : next;
      });
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [hasStarted, start, end, duration]);

  const formatNumber = (value) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return Math.round(value);
  };

  return <span ref={counterRef}>{formatNumber(count)}</span>;
};


export default function Home() {
  // State for landing images
  const [landingImage, setLandingImage] = useState(null);
  const [landingMiniImage, setLandingMiniImage] = useState(null);

  const [pricing, setPricing] = useState({
    basic: {
      perMonth: { price: 0, tokens: 0 },
      perYear: { price: 0, tokens: 0 },
    },
    premium: {
      perMonth: { price: 0, tokens: 0 },
      perYear: { price: 0, tokens: 0 },
    },
  });

  // Loading state to display spinner until data and images are loaded.
  const [loading, setLoading] = useState(true);

  // Get loggedIn state from our AuthContext
  const { loggedIn } = useAuth();

  const [stats, setStats] = useState({
    users: 0,
    tribes: 0,
    courses: 0,
    tools: 0,
  });
  

  const statSafe = (val) => (typeof val === "number" ? val : 0);

  useEffect(() => {
    async function fetchData() {
      try {
        const images = await fetchLandingImages();
        setLandingImage(images.landingImage);
        setLandingMiniImage(images.landingMiniImage);
  
        const pricingData = await fetchBasicPremiumPricing();
        setPricing(pricingData);
  
        const dashboardStats = await fetchDashboardStats();
        setStats({
          users: statSafe(dashboardStats.userCount),
          tribes: statSafe(dashboardStats.myTribesCount),
          courses: statSafe(dashboardStats.coursesCount),
          tools: statSafe(dashboardStats.tools),
        });
  
        // preload images
        const img1 = new Image();
        const img2 = new Image();
        let loadedCount = 0;
        const checkLoaded = () => {
          loadedCount++;
          if (loadedCount === 2) setLoading(false);
        };
        img1.src = images.landingImage;
        img2.src = images.landingMiniImage;
        img1.onload = checkLoaded;
        img2.onload = checkLoaded;
        img1.onerror = checkLoaded;
        img2.onerror = checkLoaded;
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  

  // Render a simple spinner while loading
  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
          }
          .spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3498db;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="main">
        {/* Hero Section */}
        <section id="hero" className="hero section dark-background">
          {landingImage ? (
         <img
         src={`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}${landingImage}`}
         alt="Landing Banner"
         data-aos="fade-in"
       />
       
          ) : null}
          <div className="container d-flex flex-column align-items-center text-center">
            <h2 data-aos="fade-up" data-aos-delay={100}>
              Your Ultimate Empowerment Platform for Entrepreneurs
            </h2>
            <p data-aos="fade-up" data-aos-delay={200}>
              Expand your business, access eCoaching, and leverage AI-powered tools for business efficiency.
            </p>
            <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay={300}>
              <Link href={loggedIn ? "/profile" : "/login"} className="btn-get-started">
                Get Started
              </Link>
            </div>
          </div>
        </section>
        {/* /Hero Section */}

        {/* About Section */}
        <section id="about" className="about section">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-up" data-aos-delay={100}>
                {landingMiniImage ? (
                  <img src={`${process.env.NEXT_PUBLIC_BASE_ENDPOINT}${landingMiniImage}`} alt="Landing Mini Banner" data-aos="fade-in" />
                ) : null}
              </div>
              <div className="col-lg-6 order-2 order-lg-1 content" data-aos="fade-up" data-aos-delay={200}>
                <h3 className="mt-3">
                  Unlock the Power of <br />
                  Entrepreneurial Success
                </h3>
                <p className="justified">
                  Join OpEn, the platform designed to empower entrepreneurs like you.
                  Whether you’re starting a business or scaling operations, OpEn provides the tools, networks, and guidance you need to succeed.
                </p>
                <ul>
                  <li>
                    <i className="bi bi-check-circle" /> <span>Empower Entrepreneurs</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle" /> <span>Tools, Networks, and Guidance</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle" /> <span>Start and scale your business</span>
                  </li>
                </ul>
                <a href="#" className="read-more">
                  <span>Know More</span>
                  <i className="bi bi-arrow-right" />
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* /About Section */}

        {/* Counts Section */}
        <section id="counts" className="section counts light-background">
  <div className="container" data-aos="fade-up" data-aos-delay={100}>
    <div className="row gy-4">
      <div className="col-lg-3 col-md-6">
        <div className="stats-item text-center w-100 h-100">
          <Counter start={0} end={stats.users} duration={1} />
          <p>Users</p>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="stats-item text-center w-100 h-100">
          <Counter start={0} end={stats.tribes} duration={1} />
          <p>Tribes</p>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="stats-item text-center w-100 h-100">
          <Counter start={0} end={stats.courses} duration={1} />
          <p>Courses</p>
        </div>
      </div>
      <div className="col-lg-3 col-md-6">
        <div className="stats-item text-center w-100 h-100">
          <Counter start={0} end={stats.tools} duration={1} />
          <p>Tools</p>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* /Counts Section */}

        {/* Pricing Section */}
        <div className="page-title" data-aos="fade-up" data-aos-delay={100}>
          <div className="heading">
            <div className="container">
              <div className="row d-flex justify-content-center text-center">
                <div className="col-lg-8">
                  <h1>Pricing</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="price">
          <section id="pricing" className="pricing section">
            <div className="container">
              <div className="row gy-3 justify-content-center">
                <div className="col-xl-3 col-lg-6" data-aos="fade-up" data-aos-delay={100}>
                  <div className="pricing-item">
                    <h3>Basic</h3>
                    <h4>
                      <sup>$</sup>
                      {pricing.basic.perMonth.price}
                      <span> / month</span>
                    </h4>
                    <h4>
                      <sup>$</sup>
                      {pricing.basic.perYear.price}
                      <span> / year</span>
                    </h4>
                    <ul>
                      <li>Access to Entrepreneurs Tribes</li>
                      <li>Customizable Business Page</li>
                      <li>Global Network Building</li>
                      <li>Startup Growth Toolkit</li>
                      <li>Higher AI Credit Cost</li>
                      <li>80% Discount to Courses Entrepreneurship</li>
                      <li>
                        AI Business Executive Assistance
                        <br />(Obtainable via Tokens)
                      </li>
                      <li>Higher AI Credit Cost</li>
                      <li>Technical Support</li>
                    </ul>
                    <div className="btn-wrap">
                      <a href={loggedIn ? "/profile" : "/login"} className="btn-buy">
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6" data-aos="fade-up" data-aos-delay={200}>
                  <div className="pricing-item featured">
                    <h3>Premium</h3>
                    <h4>
                      <sup>$</sup>
                      {pricing.premium.perMonth.price}
                      <span> / month</span>
                    </h4>
                    <h4>
                      <sup>$</sup>
                      {pricing.premium.perYear.price}
                      <span> / year</span>
                    </h4>
                    <ul>
                      <li>Access to Entrepreneurs Tribes</li>
                      <li>Customizable Business Page</li>
                      <li>Global Network Building</li>
                      <li>Startup Growth Toolkit</li>
                      <li>Higher AI Credit Cost</li>
                      <li>Full Access to Entrepreneurship Courses</li>
                      <li>
                        AI Business Executive Assistance
                        <br />(Capped Usage)
                      </li>
                      <li>Low AI Credit Cost</li>
                      <li>Faster Technical Support</li>
                    </ul>
                    <div className="btn-wrap">
                      <a href={loggedIn ? "/profile" : "/login"} className="btn-buy">
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 mx-auto text-center" data-aos="fade-up" data-aos-delay={400}>
                <div className="pricing-item featured">
                  <ul className="mb-0">
                    <li>Start Your Free 3-Day Trial Now!</li>
                    <li>
                      <b>Trial Terms:</b> Automatic billing on the 4th day;
                      cancellation options provided.
                    </li>
                  </ul>
                  <a href={loggedIn ? "/profile" : "/login"} className="btn-buy mt-0">
                    Try Now
                  </a>
                </div>
              </div>
            </div>
           </section></div>
       
        {/* Why Us Section */}
        <section id="why-us" className="section why-us">
          <div className="page-title mb-5" data-aos="fade-up" data-aos-delay={100}>
            <div className="heading">
              <div className="container">
                <div className="row d-flex justify-content-center text-center">
                  <div className="col-lg-8">
                    <h1>OpEn?</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row gy-4 d-flex justify-content-center">
              <div className="col-lg-8 d-flex align-items-stretch">
                <div className="row gy-4" data-aos="fade-up" data-aos-delay={200}>
                  <div className="col-xl-4">
                    <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-clipboard-data" />
                      <h4>Comprehensive Platform</h4>
                      <p>
                        Combines training, networking, and essential tools in one place for convenience and efficiency.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4" data-aos="fade-up" data-aos-delay={300}>
                    <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-gem" />
                      <h4>Entrepreneur-Focused</h4>
                      <p>
                        Designed specifically to address the unique challenges and opportunities entrepreneurs face.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4" data-aos="fade-up" data-aos-delay={400}>
                    <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-inboxes" />
                      <h4>Strategic Design</h4>
                      <p>
                        Features tailored to guide entrepreneurs through every stage of business growth, from ideation to scaling.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4" data-aos="fade-up" data-aos-delay={400}>
                    <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-currency-dollar" />
                      <h4>Unmatched Value</h4>
                      <p>
                        Delivers actionable insights, practical resources, and expert support at an affordable cost.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4" data-aos="fade-up" data-aos-delay={400}>
                    <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-x-diamond" />
                      <h4>Scalability</h4>
                      <p>
                        Offers tools and solutions that evolve with your business, ensuring long-term relevance and impact.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4" data-aos="fade-up" data-aos-delay={400}>
                    <div className="icon-box d-flex flex-column justify-content-center align-items-center">
                      <i className="bi bi-shuffle" />
                      <h4>Simplicity</h4>
                      <p>
                        Intuitive and user-friendly, making it easy to navigate and integrate into your entrepreneurial journey.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Features />
        <Testimonials />
      </main>
    </Layout>
  );
}
