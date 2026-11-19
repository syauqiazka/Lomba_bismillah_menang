"use client";

import React, { useEffect, useRef, useState } from "react";

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: "up" | "fade" | "scale";
  threshold?: number;
}

export function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
  threshold = 0.15,
}: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Jika sudah visible karena reduced motion, tidak perlu pasang observer
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentElem = elementRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [threshold, isVisible]);

  const getTransformClasses = () => {
    if (isVisible) {
      return "opacity-100 translate-y-0 scale-100";
    }

    switch (direction) {
      case "scale":
        return "opacity-0 scale-95 translate-y-4";
      case "fade":
        return "opacity-0";
      case "up":
      default:
        return "opacity-0 translate-y-7";
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        transitionDelay: `${delayMs}ms`,
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`transition-all ${getTransformClasses()} ${className}`}
    >
      {children}
    </div>
  );
}

interface AnimatedProgressBarProps {
  percentage: number;
  className?: string;
  barColorClass?: string;
}

export function AnimatedProgressBar({
  percentage,
  className = "w-full h-2 rounded-full bg-gray-200 overflow-hidden",
  barColorClass = "bg-[var(--color-primary)]",
}: AnimatedProgressBarProps) {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Sedikit delay agar transisi terlihat mata saat scroll
          setTimeout(() => {
            setWidth(percentage);
          }, 150);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { threshold: 0.2 }
    );

    const currentElem = containerRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [percentage]);

  return (
    <div ref={containerRef} className={className}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${barColorClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
