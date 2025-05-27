import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import axios from 'axios';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const predictions = location.state?.predictions || "";
  console.log(predictions)
  const feedbackrecent = location.state?.feedback || "";
  console.log(feedbackrecent, "feedbackrecent")
  const isfeedback = location?.state?.isfeedback || "";
  const name = location?.state?.name || "";
  const age = location?.state?.age || "";
  const user = Cookies.get('user') 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [formData, setFormData] = useState(null);
// console.log(predictions)

const handleRecentFeedback = () => {
  // const paragraphs = feedbackrecent.split('\n').filter(para => para.trim() !== '');
  setFeedback(feedbackrecent);
}
console.log(feedback, "feedback")
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('eyeFormData');
    if ( !predictions) {
      navigate('/');
      return;
    }
    if (isfeedback) {
      handleRecentFeedback()
    }

    const parsedData = JSON.parse(savedFormData);
    setFormData(parsedData);
    if (!isfeedback)
    {
      generateFeedback(parsedData);
    }
    
  }, []);

  console.log(formData, "formData")

  const generateFeedback = async (data) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/generate-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          age: data.age,
          symptoms: `Eye examination results - Left Eye: ${predictions?.leftEye?.result || 'No prediction'}, Right Eye: ${predictions.rightEye.result || 'No prediction'}`,
          medicalHistory: data.medicalHistory
        }),
      });

      const responseData = await response.json();
      if (responseData.error) {
        setError(responseData.error);
        toast.error(responseData.error);
      } else {
        const paragraphs = responseData.feedback.split('\n').filter(para => para.trim() !== '');
        setFeedback(paragraphs);
        toast.success("Feedback generated successfully!");
      }
    } catch (err) {
      toast.error("Error generating feedback");
    } finally {
      setLoading(false);
    }
  };
  console.log(feedback)
  if (!formData || !predictions) {
    return null;
  }
  const handleSave= async() => {
    const data = {
      userId: user,  // Assuming `user` is a string representing the userId
      name: formData?.name,
      age: formData?.age,
      responseData: feedback,  // Assuming feedback is an object
      prediction: predictions  // Assuming predictions is an object
    };
    try {
        const response = await axios.post('http://localhost:3000/data/feedback-post', data)
        console.log(response)
        navigate('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <NavBar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-4xl shadow-2xl overflow-hidden">
            <div className="bg-blue-950 p-8 text-white">
              <motion.h1 
                className="text-3xl font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Eye Health Assessment Report
              </motion.h1>
              <motion.p 
                className="text-blue-200 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Generated on {new Date().toLocaleDateString()}
              </motion.p>
            </div>

            <div className="p-8">
              <motion.div 
                className="grid grid-cols-2 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="text-blue-950 font-semibold">Patient Information</h3>
                    <p className="text-gray-700">Name: {formData.name || name}</p>
                    <p className="text-gray-700">Age: {formData.age || age}</p>
                    { !isfeedback && <p className="text-gray-700">Blood Group: {formData.bloodGroup}</p>}
                  </div>
                </div>
                { !isfeedback && 
                <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-blue-950 font-semibold">Contact Details</h3>
                  <p className="text-gray-700">Email: {formData.email}</p>
                  <p className="text-gray-700">Phone: {formData.phone}</p>
                </div>
              </div>}
                
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {predictions && (
                  <>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h3 className="text-blue-950 font-semibold mb-2">Left Eye Analysis</h3>
                      {predictions.leftEye.image && (
                        <img 
                          src={predictions.leftEye.image} 
                          alt="Left Eye" 
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-700 font-medium">Prediction:</p>
                        <p className="text-blue-600">{predictions.leftEye.result || 'No prediction available'}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h3 className="text-blue-950 font-semibold mb-2">Right Eye Analysis</h3>
                      {predictions.rightEye.image && (
                        <img 
                          src={predictions.rightEye.image} 
                          alt="Right Eye" 
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-gray-700 font-medium">Prediction:</p>
                        <p className="text-blue-600">{predictions.rightEye.result || 'No prediction available'}</p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
                </div>
              ) : (
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-blue-950">AI-Generated Health Feedback</h3>
                  {feedback && feedback.map((paragraph, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl"
                    >
                      <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div 
                className="mt-8 flex gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center gap-2"
                >
                  Print Report
                </motion.button>
                { !isfeedback && <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSave()}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full flex items-center gap-2"
                >
                  Save Feedback
                </motion.button>}
                { isfeedback && <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full flex items-center gap-2"
                >
                  Go to Dashboard
                </motion.button>}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full flex items-center gap-2"
                >
                  Take another test
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FeedbackPage; 

// import React, { useState } from 'react'
// import OverviewSection from '../components/OverviewSection';
// import DetailedSummary from '../components/DetailedSummary';

// const FeedbackPage = () => {
  
//   const tabs = [
//     { id: 'Overview', label: 'Overview', content: <p>Welcome to the Home Tab!</p> },
//     { id: 'Detailed Summary', label: 'Detailed Summary', content: <p>Learn more About us here.</p> },
//     // { id: 'contact', label: 'Contact', content: <p>Get in touch through Contact.</p> },
//   ]
//   const [activeTab, setActiveTab] = useState(tabs[0].id);
//   return (
//     <div className='ml-36  mt-10 border border-slate-200 rounded-2xl w-[80%] p-4'>
//       <div className='text-2xl font-bold mt-10 text-center'>
//         AI Eye Test Feedback Report
//       </div>
//       <div className='text-gray-600 text-center'>
//       Detailed analysis and feedback for your recent eye examination
//       </div>
//       <div >
//       <div className="flex  justify-center gap-30 border-b border-gray-300 bg-gray-200 mt-10 py-1 w-full rounded-lg">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-20 py-2 font-medium text-lg cursor-pointer ${
//               activeTab === tab.id
//                 ? 'bg-white px-20 text-black'
//                 : 'text-gray-600'
//             } transition`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>
//       <div className='mt-10'>
//         {
//           activeTab === 'Overview' ? (
//             <OverviewSection />
//           ) : (
//             <DetailedSummary />
//           )
//         }
//       </div>
//       </div>
//     </div>
//   )
// }

// export default FeedbackPage
