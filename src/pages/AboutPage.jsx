import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <NavBar />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-blue-200/70 py-20"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-blue-950 mb-6">About VisionAI</h1>
          <p className="text-xl text-blue-800 max-w-2xl">
            Revolutionizing eye care through artificial intelligence and advanced technology.
          </p>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-950 mb-8">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Innovation in Eye Care</h3>
              <p className="text-gray-600">
                We're dedicated to bringing cutting-edge AI technology to eye care, making advanced diagnostics accessible to everyone.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Patient-Centered Approach</h3>
              <p className="text-gray-600">
                Our focus is on providing personalized care and accurate diagnoses through our advanced AI-powered platform.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-blue-100"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-950 mb-12 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
              >
                <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2">Team Member {item}</h3>
                <p className="text-gray-600">Expert in AI and Ophthalmology</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1000+", label: "Patients Served" },
              { number: "98%", label: "Accuracy Rate" },
              { number: "24/7", label: "AI Support" },
              { number: "50+", label: "Experts" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage; 