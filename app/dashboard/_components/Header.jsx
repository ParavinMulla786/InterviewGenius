"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { AiFillHome } from "react-icons/ai";
import { MdDashboardCustomize } from "react-icons/md";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

function Header() {
  const path = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (route) => {
    router.push(route);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 text-white shadow-xl backdrop-blur-sm border-b border-purple-500/20 ${
        scrolled
          ? "bg-gradient-to-r from-[#080a1ce0] via-[#1c1958e0] to-[#431464e0]"
          : "bg-gradient-to-r from-[#080a1c] via-[#1c1958] to-[#431464]"
      }`}
    >
      {/* Glowing accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto flex justify-between items-center p-4 md:px-10 relative">
        {/* Logo and Brand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigateTo("/")}
        >
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            whileTap={{ rotate: -15, scale: 0.9 }}
            className="p-1 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 group-hover:shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)]"
          >
            <Image
              src="/logo4.png"
              width={40}
              height={40}
              alt="GeniusInterview Logo"
              className="rounded-full"
            />
          </motion.div>
          <motion.span
            className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-purple-400 bg-clip-text text-transparent hidden md:block"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            GeniusInterview
          </motion.span>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.ul
          className="hidden md:flex gap-2 font-medium text-sm"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.3 }
            }
          }}
        >
          <NavItem
            label="Home"
            icon={<AiFillHome size={18} />}
            active={path === "/"}
            onClick={() => navigateTo("/")}
          />
          <NavItem
            label="Dashboard"
            icon={<MdDashboardCustomize size={18} />}
            active={path === "/dashboard"}
            onClick={() => navigateTo("/dashboard")}
          />
          <NavItem
            label="How it works"
            icon={<BsFillQuestionSquareFill size={18} />}
            active={path.includes("howitworks")}
            onClick={() => navigateTo("/#howitworks")}
          />
        </motion.ul>

        {/* Auth Buttons & Mobile Menu Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          {isSignedIn ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 ring-2 ring-purple-400",
                    userButtonPopoverCard:
                      "bg-[#0f0a1f] border border-purple-500/20"
                  }
                }}
              />
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <SignInButton>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-white px-4 py-2 rounded-xl transition-all group hover:bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)]"
                >
                  <span className="relative overflow-hidden">
                    <span className="block group-hover:-translate-y-full transition-transform duration-300">
                      Login
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      Get Started
                    </span>
                  </span>
                  <FaUser className="group-hover:rotate-12 transition-transform" />
                </Button>
              </SignInButton>
            </motion.div>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-cyan-300 hover:text-white p-2 rounded-full hover:bg-purple-500/20"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <HiX size={24} className="text-rose-400" />
            ) : (
              <HiMenuAlt3 size={24} />
            )}
          </motion.button>
        </motion.div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute top-full left-0 right-0 bg-[#0f0a1f] shadow-xl rounded-b-xl overflow-hidden md:hidden border border-purple-500/20"
            >
              <motion.ul className="flex flex-col p-2">
                <NavItem
                  label="Home"
                  icon={<AiFillHome size={18} />}
                  active={path === "/"}
                  onClick={() => navigateTo("/")}
                  mobile
                />
                <NavItem
                  label="Dashboard"
                  icon={<MdDashboardCustomize size={18} />}
                  active={path === "/dashboard"}
                  onClick={() => navigateTo("/dashboard")}
                  mobile
                />
                <NavItem
                  label="How it works"
                  icon={<BsFillQuestionSquareFill size={18} />}
                  active={path.includes("howitworks")}
                  onClick={() => navigateTo("/#howitworks")}
                  mobile
                />
              </motion.ul>
              <div className="border-t border-purple-500/20 p-4">
                {isSignedIn ? (
                  <div className="flex justify-center">
                    <UserButton />
                  </div>
                ) : (
                  <SignInButton>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 border border-cyan-400/50 hover:border-cyan-400 text-cyan-300 hover:text-white py-3 rounded-xl transition-all hover:bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)]"
                    >
                      Login
                      <FaUser />
                    </Button>
                  </SignInButton>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

const NavItem = ({ label, icon, active, onClick, mobile = false }) => (
  <motion.li
    variants={fadeInUp}
    whileHover={{ scale: mobile ? 1.02 : 1.08 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
      mobile ? "mx-2 my-1" : ""
    } ${
      active
        ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-400/30"
        : "hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 hover:text-cyan-300 text-slate-300"
    }`}
  >
    <motion.span
      animate={{
        scale: active ? [1, 1.2, 1] : 1,
        color: active ? "#ffffff" : "#7dd3fc"
      }}
      transition={{ duration: 0.3 }}
      className="text-lg"
    >
      {icon}
    </motion.span>
    <span>{label}</span>
    {active && (
      <motion.div
        layoutId="navActiveIndicator"
        className="absolute right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_2px_rgba(167,139,250,0.8)]"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </motion.li>
);

export default Header;
