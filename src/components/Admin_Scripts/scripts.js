import Script from 'next/script';
import $ from 'jquery';

function MyApp() {
  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.min.js"
        strategy="afterInteractive"
      />
      <Script src="/assets/admin_assets/js/app.min.js" strategy="afterInteractive"></Script>
      <Script src="/assets/admin_assets/bundles/apexcharts/apexcharts.min.js" strategy="afterInteractive"></Script>
      <Script src="/assets/admin_assets/js/page/index.js" strategy="afterInteractive"></Script>
      <Script src="/assets/admin_assets/js/scripts.js" strategy="afterInteractive"></Script>
      <Script src="/assets/admin_assets/js/custom.js" strategy="afterInteractive"></Script>
    </>
  );
}

export default MyApp;