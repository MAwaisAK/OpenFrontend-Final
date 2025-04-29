import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/AuthContext";
import ProtectedRoute from "@/components/ProtectRoutes"; // Correct path here!

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
        <link rel="icon" href="../../assets/img/O.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <AuthProvider>
          <ProtectedRoute>
          {children} </ProtectedRoute>
        </AuthProvider>
       
      </body>
    </html>
  );
}
