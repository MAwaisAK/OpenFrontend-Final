
import Layout from "@/components/Layout";
import Link from "next/link";

export const metadata = {
  title: "404 Error",
  description: "404 Error",
  openGraph: {
    title: "404 Error - OpEn",
    description: "404 Error",
    type: "website",
  },
};

export default function Home() {
  // State for landing images
  return (
    <Layout>
      <main className="main">
      <section id="why-us" className="section why-us">
          <div className="page-title mb-5">
            <div className="heading">
              <div className="container">
                <div className="row d-flex justify-content-center text-center">
                  <div className="col-lg-8">
                    <h1>404 Error - Page Not Found</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>
    </Layout>
  );
}
