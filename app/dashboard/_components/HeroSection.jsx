"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineWidgets } from "react-icons/md";
import { motion, useAnimation, useInView } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

// Animation variants
const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const HeroSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <>
      {/* Cursor glow */}
      <motion.div
        className="fixed pointer-events-none z-0 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"
        animate={{
          x: mousePosition.x - 128,
          y: mousePosition.y - 128,
          transition: { type: "spring", stiffness: 50 },
        }}
      />

      <div
        ref={ref}
        className="relative w-full h-[600px] flex justify-center items-center p-6 md:p-10 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-800 text-white"
        id="hero"
      >
        {/* Floating Background Bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {hasMounted &&
            [...Array(25)].map((_, i) => {
              const width = window.innerWidth;
              const height = window.innerHeight;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-r from-cyan-300 to-purple-500 opacity-30"
                  initial={{
                    x: Math.random() * width,
                    y: Math.random() * height,
                    width: Math.random() * 20 + 10,
                    height: Math.random() * 20 + 10,
                    opacity: 0,
                  }}
                  animate={{
                    y: [Math.random() * height, Math.random() * height - 200, Math.random() * height],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: Math.random() * 20 + 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 5,
                  }}
                />
              );
            })}
        </div>

        {/* Parallax Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/bgnew2.jpg')" }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Text and CTA */}
        <motion.div
          className="relative z-10 text-center max-w-4xl space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.h2
            className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-md"
            variants={fadeInUp}
          >
            Empowering Your Career with{" "}
            <span className="text-white">
              <Typewriter
                words={["GeniusInterview", "AI Technology", "Smart Preparation"]}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={60}
                delaySpeed={1500}
              />
            </span>
          </motion.h2>

          <motion.h3
            className="text-lg md:text-2xl font-medium text-gray-100"
            variants={fadeInUp}
          >
            Transforming Interview Prep with{" "}
            <motion.span
              className="text-cyan-300 font-semibold"
              animate={{
                textShadow: [
                  "0 0 5px #00ffff",
                  "0 0 10px #a78bfa",
                  "0 0 5px #00ffff",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              Artificial Intelligence
            </motion.span>
          </motion.h3>

          <motion.p
            className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Get personalized mock interviews, instant AI feedback, and deep insights to land your dream job faster.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center mt-6"
            variants={fadeInUp}
          >
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-md shadow-cyan-400/30 hover:shadow-cyan-400/50 transition-all duration-200">
                  Get Started
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4 }}
                  >
                    <AiOutlineUser className="text-xl" />
                  </motion.span>
                </Button>
              </motion.div>
            </Link>

            <Link href="#howitworks">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-purple-800 font-bold px-8 py-4 rounded-xl transition-all duration-200">
                  How It Works
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  >
                    <MdOutlineWidgets className="text-xl" />
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Orbs for depth */}
        <motion.div
          className="absolute bottom-16 left-24 w-10 h-10 rounded-full bg-purple-400/40 blur-md"
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 right-32 w-14 h-14 rounded-full bg-cyan-300/30 blur-2xl"
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>
    </>
  );
};

export default HeroSection;
