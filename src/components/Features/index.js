"use client";
import { useState, useEffect } from "react";
import "../../styles/modal.css";

const featuresData = [
  {
    id: 1,
    title: "Entrepreneurial Mastery",
    icon: "bi-eye",
    color: "#ffbb2c",
    description:
      "<b>Feature:</b><br>" +
      "Access a self-paced training library that guides you through every stage of business growth—from ideation to scaling and building transgenerational structures. The modules are structured chronologically to deliver actionable insights and provide a clear, step-by-step roadmap to success.<br><br>" +
      "<b>Benefits:</b><br>" +
      "● <b>Strategic Structure:</b> Unlike fragmented online courses, OpEn’s progressive modules ensure your learning builds logically from one stage to the next.<br>" +
      "● <b>Cost-Effective Expertise:</b> Achieve high-level entrepreneurial insights without the expense of traditional business programs.<br>" +
      "● <b>Lifetime Relevance:</b> Designed for lifelong use, revisit and adapt strategies as your business evolves."
  },
  {
    id: 2,
    title: "Entrepreneurial Support",
    icon: "bi-infinity",
    color: "#5578ff",
    description:
      "<b>Feature:</b><br>" +
      "Join business phase-specific communities to exchange insights, brainstorm ideas, and build strategic partnerships. These tribes focus on collaborative growth, enabling real-time peer-to-peer problem-solving and valuable connections.<br><br>" +
      "<b>Benefits:</b><br>" +
      "● <b>Purpose-Driven Networking:</b> Unlike generic platforms, these communities connect you with peers facing similar challenges and opportunities.<br>" +
      "● <b>Collaborative Growth:</b> Foster partnerships that accelerate your journey rather than transactional connections.<br>" +
      "● <b>Real-Time Support:</b> Solve problems faster with immediate access to like-minded entrepreneurs."
  },
  {
    id: 3,
    title: "MyTribers",
    icon: "bi-mortarboard",
    color: "#e80368",
    description:
      "<b>Feature:</b><br>" +
      "Organize, track, and communicate with entrepreneurial connections seamlessly. MyTribers is tailored to meet the specific needs of entrepreneurs, offering tools to build deeper, more meaningful professional relationships.<br><br>" +
      "<b>Benefits:</b><br>" +
      "● <b>Tailored Connections:</b> Unlike broad professional platforms, MyTribers focuses on entrepreneurs, ensuring connections are relevant and strategic.<br>" +
      "● <b>Relationship-driven:</b> Build meaningful collaborations instead of superficial interactions.<br>" +
      "● <b>Simplified Management:</b> Stay organized and connected with a platform designed for your business needs.<br>" +
      "● <b>Possibility for Collaboration and Expansion:</b> Build strategic partnerships and collaborate with value-aligned entrepreneurs, enabling opportunities to expand beyond your local market."
  },
  {
    id: 4,
    title: "Startup Growth Toolkit",
    icon: "bi-nut",
    color: "#e361ff",
    description:
      "<b>Feature:</b><br>" +
      "Access a curated list of essential software and tools, hand-picked to streamline operations, enhance productivity, and support scaling efforts.<br><br>" +
      "<b>Benefits:</b><br>" +
      "● <b>Efficiency Focused:</b> Save time and effort with a curated directory featuring vetted top-performing tools tailored to help entrepreneurs scale their businesses effectively.<br>" +
      "● <b>Centralized Access:</b> Consolidates the best resources in one place, eliminating the need for endless online searches.<br>" +
      "● <b>Exclusive Access to a Curated Repository:</b> Gain access to a carefully researched and curated living repository of business efficiency tools, validated for their competitive pricing and reliability.<br>" +
      "● <b>Optimized for Lean Budgets:</b> Every tool is chosen to ensure you can start and operate effectively on a lean budget, balancing affordability with high performance.<br>" +
      "● <b>Business Function-Specific Organization:</b> Easily find tools categorized by business functions—whether it’s finance, marketing, operations, or more—allowing you to quickly locate the right software for your specific needs."
  },
  {
    id: 5,
    title: "Lift AI",
    icon: "bi-shuffle",
    color: "#47aeff",
    description:
      "<b>Feature:</b><br>" +
      "Lift AI is your all-in-one executive business assistant, providing proactive planning and reactive problem-solving for entrepreneurs. What sets Lift apart is its guided prompting, where the AI asks strategic probing questions to ensure clarity and actionable results.<br><br>" +
      "<b>Benefits:</b><br>" +
      "● <b>Guided Prompting for Effective Output:</b> Lift enhances your prompting process by asking strategic probing questions, ensuring clarity and actionable results at each decision-making stage.<br>" +
      "● <b>Tailored to Entrepreneurial Needs:</b> Designed specifically for business owners, Lift delivers AI-driven insights customized for key areas like Operations, Marketing, Finance, etc.<br>" +
      "● <b>Comprehensive Document Generation:</b> From SOPs to marketing plans, financial models, etc., Lift produces essential business documents tailored to your specific goals.<br>" +
      "● <b>Immediate Expertise:</b> Skip long waits for traditional consulting appointments and get on-demand advice when you need it.<br>" +
      "● <b>Audio Output Option:</b> Enables users to receive guidance or insights via audio, making it convenient for on-the-go entrepreneurs.<br>" +
      "● <b>Cost-Efficient:</b> Affordable token-based pricing, making professional business services accessible and cost-effective for startups."
  },
  {
    id: 6,
    title: "Business Learning Hub",
    icon: "bi-book",
    color: "#ff7f50",
    description:
      "<b>Feature:</b><br>" +
      "Gain access to a dynamic knowledge repository filled with case studies, expert insights, and best practices tailored for entrepreneurs.<br><br>" +
      "<b>Benefits:</b><br>" +
      "● <b>Real-World Case Studies:</b> Learn from the successes and failures of other entrepreneurs.<br>" +
      "● <b>Continuously Updated Insights:</b> Stay ahead with the latest business trends and strategies.<br>" +
      "● <b>Practical Business Knowledge:</b> Actionable guidance to help you make informed decisions."
  },
  {
    id: 7,
    title: "OpEn Support Hub",
    icon: "bi-star",
    color: "#ffa76e",
    description:
      "<b>Feature:</b><br>" +
      "Submit support tickets and receive timely, entrepreneur-specific assistance from a dedicated team.<br><br>" +
      "<b>Benefits:</b><br>" +
      "● <b>Relevant Guidance:</b> Tailored support ensures solutions align with your entrepreneurial needs.<br>" +
      "● <b>Timely Responses:</b> Get quick, actionable help without generic, automated responses.<br>" +
      "● <b>Dedicated Expertise:</b> A specialized team understands the nuances of growing businesses."
  },
  {
    id: 8,
    title: "Account Management",
    icon: "bi-gear",
    color: "#b2904f",
    description:
      "<b>Feature:</b><br>" +
      "Easily manage your profile, preferences, and security settings through a user-friendly dashboard designed specifically for entrepreneurs.<br><br>" +
      "<b>Benefits:</b><br>" +
      "● <b>Intuitive Design:</b> Unlike traditional SaaS dashboards, OpEn prioritizes simplicity and clarity.<br>" +
      "● <b>Entrepreneur-Centric Features:</b> Adjust settings to suit your business workflow effortlessly.<br>" +
      "● <b>Enhanced Control:</b> Secure, streamlined customization ensures a seamless user experience."
  }
];

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature);
  };

  const handleClose = () => {
    setSelectedFeature(null);
  };

  // Disable page scrolling when the modal is open
  useEffect(() => {
    document.body.style.overflow = selectedFeature ? "hidden" : "";
  }, [selectedFeature]);

  return (
    <section id="features" className="features section">
      {/* Page Title */}
      <div className="page-title mb-5">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1>Features</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container">
        <div className="row gy-4">
          {featuresData
            .sort((a, b) => a.id - b.id)
            .map((feature, index) => (
              <div
                key={feature.id}
                className="col-lg-3 col-md-4"
                data-aos="fade-up"
                data-aos-delay={100 * (index + 1)}
              >
                <div
                  className="features-item cursor-pointer"
                  onClick={() => handleFeatureClick(feature)}
                >
                  <i
                    className={`bi ${feature.icon}`}
                    style={{ color: feature.color }}
                  ></i>
                  <h3>
                    <a
                      href="#"
                      className="stretched-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFeatureClick(feature);
                      }}
                    >
                      {feature.title}
                    </a>
                  </h3>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {selectedFeature && (
        <div className="modal" onClick={handleClose}>
          <article
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-container-header">
              <h1 className="modal-container-title">{selectedFeature.title}</h1>
              <button
                className="icon-button"
                onClick={handleClose}
                aria-label="Close Modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  aria-hidden="true"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="currentColor"
                    d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 
                      4.95 4.95-1.414 1.414-4.95-4.95-4.95 
                      4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
                  />
                </svg>
              </button>
            </header>
            <section className="modal-container-body rtf">
              <p
                dangerouslySetInnerHTML={{
                  __html: selectedFeature.description,
                }}
              ></p>
            </section>
          </article>
        </div>
      )}
    </section>
  );
}
