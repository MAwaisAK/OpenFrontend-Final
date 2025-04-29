// pages/_app.js
import Script from 'next/script';

function MyApp() {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
        strategy="beforeInteractive"
      ></Script>
      <Script src="/assets/adminassets/vendors/js/vendor.bundle.base.js" strategy="afterInteractive"></Script>
      <Script src="/assets/adminassets/vendors/chart.js/chart.umd.js" strategy="afterInteractive"></Script>
      <Script src="/assets/adminassets/js/off-canvas.js" strategy="afterInteractive"></Script>
      <Script src="/assets/adminassets/js/template.js" strategy="afterInteractive"></Script>
      <Script src="/assets/adminassets/js/settings.js" strategy="afterInteractive"></Script>
      <Script src="/assets/adminassets/js/todolist.js" strategy="afterInteractive"></Script>
      <Script src="/assets/adminassets/js/jquery.cookie.js" type="text/javaScript" strategy="afterInteractive"></Script>
    </>
  );
}

export default MyApp;