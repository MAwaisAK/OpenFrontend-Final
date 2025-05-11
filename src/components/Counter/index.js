// components/Counter.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";

export default function Counter({ start = 0, end, duration = 1 }) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          obs.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    const total = duration * 1000;
    const step = 50;
    const steps = total / step;
    const inc = (end - start) / steps;
    let current = 0;

    const iv = setInterval(() => {
      current++;
      setCount(prev => {
        const next = prev + inc;
        return next >= end ? end : next;
      });
      if (current >= steps) clearInterval(iv);
    }, step);

    return () => clearInterval(iv);
  }, [hasStarted, start, end, duration]);

  const fmt = v => {
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
    return Math.round(v);
  };

  return <span ref={ref}>{fmt(count)}</span>;
}
