import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Eye Care",
      excerpt: "Exploring how artificial intelligence is revolutionizing the field of ophthalmology and improving patient outcomes.",
      date: "March 15, 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      title: "Understanding Common Eye Conditions",
      excerpt: "A comprehensive guide to recognizing and understanding various eye conditions and their symptoms.",
      date: "March 10, 2024",
      category: "Health",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      title: "Digital Eye Strain: Prevention and Care",
      excerpt: "Learn about the effects of prolonged screen time on your eyes and how to protect your vision in the digital age.",
      date: "March 5, 2024",
      category: "Wellness",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

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
          <h1 className="text-5xl font-bold text-blue-950 mb-6">VisionAI Blog</h1>
          <p className="text-xl text-blue-800 max-w-2xl">
            Stay updated with the latest in eye care technology and health insights.
          </p>
        </div>
      </motion.div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-blue-600">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-950 mb-4">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full"
                >
                  Read More
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-blue-100 py-16"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-blue-950 mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Stay updated with the latest news, articles, and insights about eye care and AI technology.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-full"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogPage; 