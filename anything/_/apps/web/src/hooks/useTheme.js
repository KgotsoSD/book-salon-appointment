import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Always use light girly theme
    setIsDark(false);
  }, []);

  return {
    isDark: false,
    background:
      "linear-gradient(135deg, #FFF5F7 0%, #FFE8F0 50%, #FFD6E8 100%)",
    text: {
      primary: "text-[#2D1B2E]",
      secondary: "text-[#6B4C6D]",
      muted: "text-[#9D7B9E]",
      faint: "text-[#C9B3CA]",
      decoration: "text-[#FFB6D9]/30",
      accent: "text-[#FF69B4]",
    },
    bg: {
      overlay: "bg-white/60",
      overlayHover: "bg-white/80",
      card: "bg-white/70",
      border: "border-[#FFD6E8]",
      borderHover: "border-[#FFB6D9]",
      accent: "bg-gradient-to-r from-[#FF69B4] to-[#FF1493]",
      accentSoft: "bg-[#FFE8F0]",
      accentText: "text-white",
    },
    hover: {
      text: "hover:text-[#FF69B4]",
      bg: "hover:bg-white/80",
    },
  };
}
