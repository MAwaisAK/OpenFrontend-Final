
import Layout from "@/components/Layout";

export const metadata = {
  title: "Terms & Condition",
  description: "Read our Terms & Condition to learn how we protect your data.",
  openGraph: {
    title: "Terms & Condition - OpEn",
    description: "Read our Privacy Policy to learn how we protect your personal information.",
    url: "https://yourcompany.com/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  // State for landing images
  return (
    <Layout>
      <main className="main">
      <section id="why-us" className="section why-us">
          <div className="page-title mb-5" data-aos="fade-up" data-aos-delay={100}>
            <div className="heading">
              <div className="container">
                <div className="row d-flex justify-content-center text-center">
                  <div className="col-lg-8">
                    <h1>Terms & Condition</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row gy-12 d-flex">
              <div className="col-lg-12 d-flex">
                <div className="row gy-12" data-aos="fade-up" data-aos-delay={200}>
                  <div className="col-xl-12" data-aos="fade-up" data-aos-delay={400}>
                    <div className=" flex-column">
                    <div id="acceptance">
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using OpEn Platform (“OpEn,” “we,” “us,” or “our”), you agree to be bound by these Terms and Conditions (“Terms”). If you do not agree, you must not use the Platform.</p>
  </div>

  <div id="definitions">
    <h2>2. Definitions</h2>
    <ul>
      <li><strong>User</strong>: Any individual or entity that registers for or uses the Platform.</li>
      <li><strong>Content</strong>: All text, images, data, audio, video, software, and other materials provided through OpEn.</li>
      <li><strong>Tribes</strong>: Phase-specific entrepreneur communities administered via the Platform.</li>
      <li><strong>MyTribers</strong>: User’s personal network on the Platform.</li>
      <li><strong>Lift AI</strong>: The AI-driven executive assistant feature of OpEn.</li>
    </ul>
  </div>

  <div id="registration">
    <h2>3. Registration &amp; Account Security</h2>
    <ol>
      <li><strong>Eligibility</strong>: You must be at least 18 years old and able to enter legally binding contracts.</li>
      <li><strong>Account Information</strong>: You agree to provide truthful, accurate, and up-to-date information.</li>
      <li><strong>Credentials</strong>: You are responsible for maintaining the confidentiality of your username, password, and any other security credentials. You accept all risks of unauthorized access to your account.</li>
    </ol>
  </div>

  <div id="subscriptions">
    <h2>4. Subscriptions, Fees &amp; Payment</h2>
    <ol>
      <li><strong>Plans</strong>: OpEn Basic and OpEn Premium, with monthly or annual billing options, as detailed on our Pricing page.</li>
      <li><strong>Free Trial</strong>: A 3-day free trial applies to new subscribers. If not canceled before the end of Day 3, billing starts automatically on Day 4.</li>
      <li><strong>Billing</strong>: All payments are processed by Stripe. We do <strong>not</strong> collect or store credit-card information on our servers; Stripe handles all payment credentials.</li>
      <li><strong>Refunds</strong>: Except as required by law, fees are non-refundable once the trial period expires or services are rendered.</li>
    </ol>
  </div>

  <div id="use">
    <h2>5. Use of the Platform</h2>
    <ol>
      <li><strong>License</strong>: We grant you a limited, non-exclusive, non-transferable license to access and use OpEn in compliance with these Terms.</li>
      <li><strong>Prohibited Conduct</strong>: You may not (a) reverse engineer the Platform; (b) use the Platform for unlawful activities; (c) upload malicious code; or (d) infringe any third-party rights.</li>
      <li><strong>Content Ownership</strong>: You retain ownership of your own Content. By posting, you grant us a worldwide, royalty-free license to use, reproduce, and display that Content to provide and improve the service.</li>
    </ol>
  </div>

  <div id="ugc">
    <h2>6. User-Generated Content &amp; Community Guidelines</h2>
    <ol>
      <li><strong>Responsibility</strong>: You are solely responsible for any Content you create, share, or transmit on the Platform.</li>
      <li><strong>Moderation</strong>: OpEn reserves the right to remove or disable access to any Content that violates these Terms.</li>
      <li><strong>Tribes Administration</strong>: All Tribes are managed by administrators; decisions regarding membership, content approval, and moderation rest with them.</li>
    </ol>
  </div>

  <div id="privacy">
    <h2>7. Privacy &amp; Data Use</h2>
    <ol>
      <li><strong>Personal Data</strong>: Our Privacy Policy (separate document) explains how we collect, use, and share your personal information.</li>
      <li><strong>Admin Access</strong>: Administrative staff cannot view your personal private data unless required to troubleshoot or manage the database; any access is logged and subject to strict internal controls.</li>
      <li><strong>Lift AI Data</strong>: Lift AI does <strong>not</strong> store the text of your prompts or responses—only token usage metrics are retained for billing and analytics.</li>
      <li><strong>Messaging</strong>: Messages between users (including Tribe chats and MyTribers messages) are <strong>not</strong> end-to-end encrypted; please do not share highly sensitive data over chat.</li>
    </ol>
  </div>

  <div id="intellectual-property">
    <h2>8. Intellectual Property</h2>
    <p>All Platform software, designs, logos, trademarks, and related materials are the exclusive property of OpEn or its licensors and are protected by intellectual property laws.</p>
  </div>

  <div id="warranty">
    <h2>9. Disclaimer of Warranties</h2>
    <p>THE PLATFORM IS PROVIDED “AS-IS” AND “AS-AVAILABLE” WITHOUT WARRANTIES OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, OpEn DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
  </div>

  <div id="liability">
    <h2>10. Limitation of Liability</h2>
    <p>IN NO EVENT SHALL OpEn, ITS AFFILIATES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE PLATFORM, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR AGGREGATE LIABILITY FOR DIRECT DAMAGES SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO OpEn IN THE PRIOR SIX MONTHS.</p>
  </div>

  <div id="indemnification">
    <h2>11. Indemnification</h2>
    <p>You agree to indemnify and hold harmless OpEn, its officers, directors, employees, and agents from any claims, losses, liabilities, damages, and expenses arising out of your use of the Platform or violation of these Terms.</p>
  </div>

  <div id="termination">
    <h2>12. Termination</h2>
    <p>We may suspend or terminate your access at any time for violation of these Terms or for any other reason, with or without notice. Upon termination, your right to use the Platform ceases immediately.</p>
  </div>

  <div id="changes">
    <h2>13. Changes to Terms</h2>
    <p>We may modify these Terms at any time by posting revised Terms on the Platform. Your continued use after such posting constitutes acceptance of the new Terms.</p>
  </div>

  <div id="governing-law">
    <h2>14. Governing Law &amp; Dispute Resolution</h2>
    <p>These Terms are governed by the laws of [State/Country]. Any disputes will be resolved in the state or federal courts located in [Venue], and you consent to the jurisdiction of such courts.</p>
  </div>

  <div id="contact">
    <h2>15. Contact Us</h2>
    <p>For questions about these Terms, please email: <a href="mailto:support@openplatform.com">support@openplatform.com</a></p>
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
