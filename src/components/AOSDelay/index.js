"use client";  // Ensure it runs only on the client side

import { useEffect } from "react";
import AOS from "aos";
import '../../styles/vendor/aos/aos.css';

export default function AOSInit() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true }); // Initialize AOS
  }, []);

  return null; // This component doesn't render anything, it just runs AOS
}
