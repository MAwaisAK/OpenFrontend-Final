import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectRoutes"; // Correct path here!
import Nav from "@/components/Nav"; // Correct path here!
import LayoutWrapper from "@/components/LayoutWrapper"; // <- New import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "OpEn",
    template: "%s | OpEn",
  },
  description: "OpEn",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4469304838128644"
     crossorigin="anonymous"></script>
        <link rel="icon" href="../../assets/img/O.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <AuthProvider>
          <ProtectedRoute>
            <LayoutWrapper>{children}</LayoutWrapper>
           </ProtectedRoute>
        </AuthProvider>
       
      </body>
    </html>
  );
}
