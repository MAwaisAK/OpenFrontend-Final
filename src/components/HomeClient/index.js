// components/HomeClient.jsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonals";
import Counter from "@/components/Counter";
import { useAuth } from "@/lib/AuthContext";

export default function HomeClient({ landingImage, landingMiniImage, pricing, stats }) {
  const { loggedIn } = useAuth();

  return (
    <Layout>
      <main className="main">
        {/* Hero */}
        <section id="hero" className="hero section dark-background">
          {landingImage && (
            <Image
              src={landingImage}
              alt="Landing Banner"
              width={1200}
              height={600}
              priority
              unoptimized
              placeholder="blur"
              blurDataURL={landingMiniImage}
            />
          )}
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

        {/* About */}
        <section id="about" className="about section">
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-6 order-1 order-lg-2" data-aos="fade-up" data-aos-delay={100}>
                {landingMiniImage && (
                  <Image
                    src={landingMiniImage}
                    alt="Landing Mini Banner"
                    width={800}
                    height={450}
                    placeholder="blur"
                    unoptimized
                    blurDataURL={landingMiniImage}
                  />
                )}
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
                  <li><i className="bi bi-check-circle" /> Empower Entrepreneurs</li>
                  <li><i className="bi bi-check-circle" /> Tools, Networks, and Guidance</li>
                  <li><i className="bi bi-check-circle" /> Start and scale your business</li>
                </ul>
                <a href="#" className="read-more">
                  <span>Know More</span> <i className="bi bi-arrow-right" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Counts */}
        <section id="counts" className="section counts light-background">
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div className="row gy-4">
              {["users", "tribes", "courses", "tools"].map((key) => (
                <div key={key} className="col-lg-3 col-md-6">
                  <div className="stats-item text-center w-100 h-100">
                    <Counter start={0} end={stats[key]} duration={1} />
                    <p>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <div className="page-title" data-aos="fade-up" data-aos-delay={100}>
          <div className="heading">
            <div className="container">
              <div className="row d-flex justify-content-center text-center">
                <div className="col-lg-8"><h1>Pricing</h1></div>
              </div>
            </div>
          </div>
        </div>
        <section id="pricing" className="pricing section">
          <div className="container">
            <div className="row gy-3 justify-content-center">
              {["basic", "premium"].map((tier, i) => (
                <div
                  key={tier}
                  className="col-xl-3 col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay={100 + i * 100}
                >
                  <div className={`pricing-item${tier === "premium" ? " featured" : ""}`}>
                    <h3>{tier.charAt(0).toUpperCase() + tier.slice(1)}</h3>
                    <h4>
                      <sup>$</sup>{pricing[tier].perMonth.price}
                      <span> / month</span>
                    </h4>
                    <h4>
                      <sup>$</sup>{pricing[tier].perYear.price}
                      <span> / year</span>
                    </h4>
                    <ul>
                      <li>Access to Entrepreneurs Tribes</li>
                      <li>Customizable Business Page</li>
                      <li>Global Network Building</li>
                      <li>Startup Growth Toolkit</li>
                      {tier === "basic" ? (
                        <>
                          <li>Higher AI Credit Cost</li>
                          <li>80% Discount to Courses Entrepreneurship</li>
                          <li>AI Business Executive Assistance<br/>(Obtainable via Tokens)</li>
                        </>
                      ) : (
                        <>
                          <li>Full Access to Entrepreneurship Courses</li>
                          <li>AI Business Executive Assistance<br/>(Capped Usage)</li>
                          <li>Low AI Credit Cost</li>
                          <li>Faster Technical Support</li>
                        </>
                      )}
                      <li>Technical Support</li>
                    </ul>
                    <div className="btn-wrap">
                      <Link href={loggedIn ? "/profile" : "/login"} className="btn-buy">
                        {tier === "basic" ? "Buy Basic" : "Buy Premium"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="col-xl-6 col-lg-6 mx-auto text-center"
              data-aos="fade-up"
              data-aos-delay={400}
            >
              <div className="pricing-item featured">
                <ul className="mb-0">
                  <li>Start Your Free 3-Day Trial Now!</li>
                  <li><b>Trial Terms:</b> Automatic billing on the 4th day; cancellation options provided.</li>
                </ul>
                <Link href={loggedIn ? "/profile" : "/login"} className="btn-buy mt-0">
                  Try Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us, Features, Testimonials */}
        <section id="why-us" className="section why-us">
          {/* …icon-box grid… */}
        </section>
        <Features />
        <Testimonials />
      </main>
    </Layout>
  );
}
