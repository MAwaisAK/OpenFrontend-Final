"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { loggedIn, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1️⃣ Admins should never see /profile
    if (isAdmin && pathname.startsWith("/profile")) {
      router.push("/admin/opulententrepreneurs/open/dashboard");
      return;
    }

    // 2️⃣ Non-admins should never see the admin dashboard
    if (pathname.startsWith("/admin/opulententrepreneurs/open")) {
      if (!loggedIn) {
        router.push("/login");
        return;
      }
      if (!isAdmin) {
        router.push("/profile");
        return;
      }
    }

    // 3️⃣ Any unauthenticated user on profile or any /admin path goes to login
    if (!loggedIn && (pathname.startsWith("/profile") || pathname.startsWith("/admin"))) {
      router.push("/login");
      return;
    }
  }, [pathname, loggedIn, isAdmin, router]);

  // While we're redirecting, render nothing
  if (
    (isAdmin && pathname.startsWith("/profile")) ||
    (!loggedIn && (pathname.startsWith("/profile") || pathname.startsWith("/admin"))) ||
    (pathname.startsWith("/admin/opulententrepreneurs/open/dashboard") && (!loggedIn || !isAdmin))
  ) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
