import React from "react";
import { SiGooglegemini, SiDrizzle } from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { FaReact } from "react-icons/fa";

const AIpower = () => {
  return (
    <section className="py-12 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light text-gray-800 mb-3">
          Built with <span className="font-bold text-green-600">Precision</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          CareerBoost-AI leverages powerful technologies to deliver realistic interview simulations.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {/* Gemini AI */}
        <div className="w-40 h-40 flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <SiGooglegemini className="text-blue-600 text-xl" />
          </div>
          <h3 className="font-medium text-gray-800">Gemini AI</h3>
          <p className="text-xs text-gray-500 text-center mt-1">Smart question generation</p>
        </div>

        {/* Next.js */}
        <div className="w-40 h-40 flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <RiNextjsFill className="text-gray-800 text-xl" />
          </div>
          <h3 className="font-medium text-gray-800">Next.js</h3>
          <p className="text-xs text-gray-500 text-center mt-1">Fast & scalable</p>
        </div>

        {/* React */}
        <div className="w-40 h-40 flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <FaReact className="text-blue-500 text-xl" />
          </div>
          <h3 className="font-medium text-gray-800">React</h3>
          <p className="text-xs text-gray-500 text-center mt-1">Interactive UI</p>
        </div>

        {/* Drizzle ORM */}
        <div className="w-40 h-40 flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
            <SiDrizzle className="text-green-600 text-xl" />
          </div>
          <h3 className="font-medium text-gray-800">Drizzle ORM</h3>
          <p className="text-xs text-gray-500 text-center mt-1">Reliable data</p>
        </div>
      </div>
    </section>
  );
};

export default AIpower;