import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Read our Privacy Policy to learn how we protect your data.",
  openGraph: {
    title: "Privacy Policy - OpEn",
    description: "Read our Privacy Policy to learn how we protect your personal information.",
    url: "https://yourcompany.com/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  return (
    <Layout>
      <main className="main">
        <section id="why-us" className="section why-us">
          <div className="page-title mb-5" data-aos="fade-up" data-aos-delay={100}>
            <div className="heading">
              <div className="container">
                <div className="row d-flex justify-content-center text-center">
                  <div className="col-lg-8">
                    <h1>Privacy & Policy</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row gy-12">
              <div className="col-lg-12">
                <div className="row gy-12" data-aos="fade-up" data-aos-delay={200}>
                  <div className="col-xl-12" data-aos="fade-up" data-aos-delay={400}>
                    <div className="flex-column">
                    <div id="introduction">
    <h2>1. Introduction</h2>
    <p>This Privacy Policy explains how OpEn Platform (“OpEn,” “we,” “us,” “our”) collects, uses, discloses, and protects your personal information when you use our website and services.</p>
  </div>

  <div id="information-collected">
    <h2>2. Information We Collect</h2>
    <ul>
      <li><strong>Account Information</strong>: Name, email address, password, profile details.</li>
      <li><strong>Usage Data</strong>: Pages viewed, time spent, clicks, device and browser metadata, IP address, and cookies.</li>
      <li><strong>Payment Data</strong>: Billing name and address. <strong>We do not</strong> collect or store credit-card numbers; all payment processing is handled by Stripe.</li>
      <li><strong>AI Usage Metrics</strong>: Token consumption by Lift AI for billing purposes; no prompt or response text is stored.</li>
      <li><strong>Support Data</strong>: Information you provide when submitting a support ticket.</li>
    </ul>
  </div>

  <div id="use-of-info">
    <h2>3. How We Use Your Information</h2>
    <ul>
      <li>To Provide Services: Account creation, access to features, content delivery.</li>
      <li>Billing & Payments: Subscription management, invoicing, payment processing via Stripe.</li>
      <li>Communications: Service updates, newsletters (you may opt out), transactional emails.</li>
      <li>Improvement &amp; Analytics: Platform usage analysis, feature enhancement, AI model tuning (with anonymized metrics).</li>
      <li>Support: Responding to inquiries, troubleshooting technical issues.</li>
    </ul>
  </div>

  <div id="sharing">
    <h2>4. Information Sharing &amp; Disclosure</h2>
    <ol>
      <li>Service Providers: Stripe for payments, hosting providers, analytics vendors—all subject to confidentiality obligations.</li>
      <li>Legal Requirements: In response to lawful requests by public authorities.</li>
      <li>Business Transfers: If OpEn is merged, sold, or reorganized, user data may be transferred as an asset.</li>
      <li>With Your Consent: Any other disclosures with your explicit permission.</li>
    </ol>
  </div>

  <div id="security">
    <h2>5. Data Security</h2>
    <p>We implement administrative, technical, and physical safeguards to protect your data. Access to personal private data is restricted—admins may only view it when necessary for support or database maintenance, and such access is logged and audited.</p>
  </div>

  <div id="retention">
    <h2>6. Data Retention</h2>
    <p>We retain your personal data for as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
  </div>

  <div id="rights">
    <h2>7. Your Rights</h2>
    <p>Depending on your jurisdiction, you may have rights to:</p>
    <ul>
      <li>Access, correct, or delete your personal data.</li>
      <li>Object to or restrict processing.</li>
      <li>Withdraw consent for marketing communications.</li>
    </ul>
    <p>To exercise these rights, email <a href="mailto:privacy@openplatform.com">privacy@openplatform.com</a>.</p>
  </div>

  <div id="cookies">
    <h2>8. Cookies &amp; Tracking</h2>
    <p>Our website uses cookies and similar technologies to enhance user experience, analyze usage, and deliver personalized content. You may control cookie preferences via your browser settings.</p>
  </div>

  <div id="children">
    <h2>9. Children’s Privacy</h2>
    <p>OpEn is not intended for children under 18. We do not knowingly collect personal data from minors. If we learn we have, we will delete it promptly.</p>
  </div>

  <div id="changes-policy">
    <h2>10. Changes to This Policy</h2>
    <p>We may update this Privacy Policy by posting changes on the Platform with a new Effective Date. Continued use after changes indicates acceptance.</p>
  </div>

  <div id="contact-privacy">
    <h2>11. Contact Information</h2>
    <p>If you have questions or complaints about this Privacy Policy, contact:<br/>
    Email: <a href="mailto:privacy@openplatform.com">privacy@openplatform.com</a><br/>
    Address: Opulence Capital, 123 Entrepreneur Way, Business City, Country</p>
  </div>

                    </div>
                  </div>
                  {/* End Icon Box */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
