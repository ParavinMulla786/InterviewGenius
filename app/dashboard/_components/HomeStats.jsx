"use client";

import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaBook, FaFileAlt, FaBrain, FaSearch, FaArrowRight } from "react-icons/fa";
import { m, LazyMotion, domAnimation } from "framer-motion";

const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.2, 0.65, 0.3, 0.9],
    }
  }
};

const ResourceCard = ({ title, description, links, icon, index }) => {
  return (
    <m.div
      className="rounded-xl border-2 border-gray-100/50 bg-white/10 backdrop-blur-sm p-6 shadow-lg transition-all hover:shadow-xl hover:border-cyan-300/50 hover:bg-white/20"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-cyan-400 to-purple-500 p-3 rounded-xl text-white">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-200">{description}</p>
          
          <div className="mt-5 space-y-2">
            <h4 className="text-xs font-medium text-cyan-200 uppercase tracking-wider">Recommended Resources:</h4>
            <div className="flex flex-wrap gap-3">
              {links.map((link, idx) => (
                <m.a 
                  key={idx}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-cyan-300/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                  <FaExternalLinkAlt className="text-xs opacity-70" />
                </m.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
};

const FloatingParticles = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <m.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400/10 to-purple-400/10"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            opacity: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 0.4, 0],
            transition: {
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5
            }
          }}
        />
      ))}
    </div>
  );
};

const HomeStats = () => {
  const resources = [
    {
      title: "Technical Interview Preparation",
      description: "Master coding interviews with these comprehensive resources for DSA, system design, and problem solving.",
      icon: <FaBook className="text-lg" />,
      links: [
        { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/" },
        { name: "LeetCode", url: "https://leetcode.com/" },
        { name: "HackerRank", url: "https://www.hackerrank.com/" },
        { name: "CodeChef", url: "https://www.codechef.com/" },
        { name: "Javatpoint", url: "https://www.javatpoint.com/" },
        { name: "InterviewBit", url: "https://www.interviewbit.com/" },
      ]
    },
    {
      title: "Resume Building Tools",
      description: "Create professional resumes that stand out to recruiters and pass through ATS systems.",
      icon: <FaFileAlt className="text-lg" />,
      links: [
        { name: "Canva", url: "https://www.canva.com/resumes/" },
        { name: "Novoresume", url: "https://novoresume.com/" },
        { name: "Zety", url: "https://zety.com/" },
        { name: "Resume.com", url: "https://www.resume.com/" },
        { name: "VisualCV", url: "https://www.visualcv.com/" },
      ]
    },
    {
      title: "Aptitude Preparation",
      description: "Prepare for quantitative, logical, and verbal ability tests commonly used in recruitment.",
      icon: <FaBrain className="text-lg" />,
      links: [
        { name: "IndiaBIX", url: "https://www.indiabix.com/" },
        { name: "AptitudeTest", url: "https://www.aptitude-test.com/" },
        { name: "TestDome", url: "https://www.testdome.com/" },
        { name: "AptitudePrep", url: "https://aptitudeprep.com/" },
      ]
    },
    {
      title: "Job Search Platforms",
      description: "Find your dream job through these leading job portals and professional networks.",
      icon: <FaSearch className="text-lg" />,
      links: [
        { name: "LinkedIn", url: "https://www.linkedin.com/" },
        { name: "Naukri", url: "https://www.naukri.com/" },
        { name: "Indeed", url: "https://www.indeed.com/" },
        { name: "AngelList", url: "https://angel.co/" },
        { name: "Glassdoor", url: "https://www.glassdoor.com/" },
        { name: "Monster", url: "https://www.monster.com/" },
      ]
    }
  ];

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-fuchsia-800/95" id="resources">
        {/* Background elements */}
        <FloatingParticles />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <m.div 
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <m.h2 
              className="text-4xl font-extrabold text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
              variants={fadeInUp}
            >
              Interview Preparation Resources
            </m.h2>
            <m.p 
              className="mt-5 text-lg text-gray-300 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Everything you need to prepare for your next job interview in one place
            </m.p>
          </m.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <ResourceCard 
                key={index}
                title={resource.title}
                description={resource.description}
                links={resource.links}
                icon={resource.icon}
                index={index}
              />
            ))}
          </div>

          <m.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <m.a 
              href="#contact" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium hover:from-cyan-600 hover:to-indigo-700 transition-all group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Need personalized recommendations?
              <span className="group-hover:translate-x-1 transition-transform">
                <FaArrowRight />
              </span>
            </m.a>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
};

export default HomeStats;