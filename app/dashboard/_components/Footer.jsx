import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden text-white py-10">
      {/* 🔮 Glowing Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

      {/* ✨ Floating Radial Glow Orbs */}
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 right-0 w-72 h-72 bg-cyan-400 rounded-full mix-blend-overlay filter blur-2xl opacity-20 animate-ping"></div>

      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* 🔗 Logo */}
        <img
          src="/logo3.png"
          alt="InterviewGenius Logo"
          className="mx-auto mb-4 w-32 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
        />

        {/* 💡 Slogan */}
        <h2 className="text-xl md:text-2xl font-bold italic mb-2 text-teal-300 drop-shadow-lg">
          "Practice Like a Genius. Perform Like a Pro."
        </h2>

        
      </div>
    </footer>
  );
};

export default Footer;
