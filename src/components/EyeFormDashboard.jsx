import React, { forwardRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../helper/AuthContext';
import axios from 'axios';

const EyeFormSection = forwardRef((props, ref) => {
    const navigate = useNavigate();
    // const conditions = ["CATARACTS", "GLAUCOMA", "DIABETIC RETINOPATHY", "REFRACTIVE ERRORS"];
    
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      location: '',
      age: '',
      bloodGroup: '',
      message: ''
    });
  
    const [leftEyeImage, setLeftEyeImage] = useState(null);
    const [rightEyeImage, setRightEyeImage] = useState(null);
    const user = useAuth()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [prediction, setPrediction] = useState('');
    const [prediction1, setPrediction1] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
    const [suggestions, setSuggestions] = useState([]);
    const handleInputLocationChange = async(e) => {
      const {value} = e.target;
      setFormData({ ...formData, location: value});
  
      if (value.length > 2) {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/recommendations`, {
            params: { location: value }
          });
  
          setSuggestions(response.data.recommendations || [])
        } catch (error) {
          console.log(error)
          setSuggestions([])
        } finally {
          setLoading(false)
        }
      } else {
        setSuggestions([])
      }
    }
  
    // const debouncedInputChange = useCallback(
    //   debounce(handleInputLocationChange, 500), // 500ms debounce
    //   []
    // );
    const handleSuggestionSelect = (suggestion) => {
      setFormData({ ...formData, location: suggestion });
      setSuggestions([]);
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' && suggestions.length > 0) {
        e.preventDefault();
        handleSuggestionSelect(suggestions[0]);
      }
    };
  
    const handleImageChange = (e, eye) => {
      const file = e.target.files[0];
      if (file) {
        if (eye === 'left') {
          setLeftEyeImage(file);
        } else {
          setRightEyeImage(file);
        }
      }
    };
  
    const validateForm = () => {
      const errors = [];
      
      if (!formData.name.trim()) errors.push('Name is required');
      if (!formData.email.trim()) errors.push('Email is required');
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.push('Invalid email format');
      if (!formData.phone.trim()) errors.push('Phone number is required');
      if (!/^\d{10}$/.test(formData.phone)) errors.push('Invalid phone number format');
      if (!formData.location.trim()) errors.push('Location is required');
      if (!formData.age || formData.age < 1) errors.push('Valid age is required');
      if (!formData.bloodGroup) errors.push('Blood group is required');
      if (!leftEyeImage) errors.push('Left eye image is required');
      if (!rightEyeImage) errors.push('Right eye image is required');
  
      return errors;
    };
  
    const handleImageSubmit = async (eye) => {
      const imageFile = eye === 'left' ? leftEyeImage : rightEyeImage;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        setLoading(true);
        setError('');
  
        try {
          const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: formData,
          });
    
          const data = await response.json();
          
          if (data.error) {
            setError(data.error);
            toast.error(data.error);
          } else {
            if (eye === 'left') {
              setPrediction(data.prediction);
              sessionStorage.setItem('leftEyePrediction', data.prediction);
            } else {
              setPrediction1(data.prediction);
              sessionStorage.setItem('rightEyePrediction', data.prediction);
            }
            toast.success(`${eye.charAt(0).toUpperCase() + eye.slice(1)} eye analysis completed`);
          }
        } catch (err) {
          const errorMsg = 'Error occurred while uploading the file.';
          setError(errorMsg);
          toast.error(errorMsg);
        } finally {
          setLoading(false);
        }
      } else {
        const errorMsg = `No ${eye} eye image selected`;
        setError(errorMsg);
        toast.error(errorMsg);
      }
    };
  
    // const generateFeedback = async () => {
    //   try {
    //     const response = await fetch("http://127.0.0.1:5000/generate-feedback", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         name: formData.name,
    //         age: formData.age,
    //         symptoms: `Eye examination results - Left Eye: ${prediction || 'No prediction'}, Right Eye: ${prediction1 || 'No prediction'}`,
    //         medicalHistory: formData.message || ''
    //       }),
    //     });
  
    //     const data = await response.json();
    //     if (data.error) {
    //       toast.error(data.error);
    //     } else {
    //       const paragraphs = data.feedback.split('\n').filter(para => para.trim() !== '');
    //       setAiResponse(paragraphs);
    //       setShowFeedback(true);
    //       toast.success("Feedback generated successfully!");
    //     }
    //   } catch (err) {
    //     toast.error("Error generating feedback");
    //   }
    // };
    // console.log(prediction, prediction1)
   const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (user === '') {
      return;
    }
  
    const validationErrors = validateForm();
  
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }
  
    setLoading(true);
  
    try {
      // Process both eyes
      await handleImageSubmit('left');
      await handleImageSubmit('right');
  
      if (!error) {
        toast.success('Analysis completed successfully!');
  
        // Store form data in sessionStorage
        sessionStorage.setItem('eyeFormData', JSON.stringify({
          name: formData.name,
          age: formData.age,
          email: formData.email,
          phone: formData.phone,
          bloodGroup: formData.bloodGroup,
          medicalHistory: formData.message || ''
        }));
  
        // Wait for predictions to be set before navigating
        setTimeout(async () => {
          try {
            const leftPrediction = sessionStorage.getItem('leftEyePrediction');
            const rightPrediction = sessionStorage.getItem('rightEyePrediction');
            const leftEyeBase64 = await getBase64(leftEyeImage);
            const rightEyeBase64 = await getBase64(rightEyeImage);
  
            console.log('Predictions before navigation:', {
              left: leftPrediction,
              right: rightPrediction
            });
  
            // Navigate to feedback page with predictions data
            navigate('/feedback', {
              state: {
                predictions: {
                  leftEye: {
                    result: leftPrediction,
                    image: leftEyeBase64
                  },
                  rightEye: {
                    result: rightPrediction,
                    image: rightEyeBase64
                  }
                }
              }
            });
          } catch (conversionError) {
            console.error('Image conversion error:', conversionError);
            toast.error('Error processing images');
          }
        }, 2000); // Wait for 2 seconds to ensure state updates
      }
    } catch (err) {
      toast.error('An error occurred while processing your submission');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  
    // Helper function to convert image to base64
    const getBase64 = (file) => {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    };

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-100 to-white flex items-center justify-center py-20">
      <div className="w-full max-w-4xl bg-white/90 p-8 rounded-2xl shadow-xl">
        <h2 className="text-center text-3xl font-bold text-blue-950 mb-8">START YOUR EYE HEALTH ASSESSMENT</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-lg text-blue-950 mb-2">NAME</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-4 border border-blue-600 rounded-xl"
                placeholder="Enter your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg text-blue-950 mb-2">EMAIL</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-4 border border-blue-600 rounded-xl"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-lg text-blue-950 mb-2">PHONE NUMBER</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-4 border border-blue-600 rounded-xl"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-lg text-blue-950 mb-2">LOCATION</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputLocationChange}
                className="w-full p-4 border border-blue-600 rounded-xl"
                placeholder="Enter your location"
              />
            </div>
            {suggestions.length > 0 && (
    <ul className="absolute z-10 w-1/2 mt-1 bg-white shadow-lg max-h-60 rounded-xl overflow-auto border border-blue-200">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-blue-950 border-b border-blue-100 last:border-b-0"
          onClick={() => handleSuggestionSelect(suggestion)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className="block text-lg text-blue-950 mb-2">AGE</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full p-4 border border-blue-600 rounded-xl"
                placeholder="Enter your age"
              />
            </div>
            <div>
              <label htmlFor="bloodGroup" className="block text-lg text-blue-950 mb-2">BLOOD GROUP</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full p-4 border border-blue-600 rounded-xl"
              >
                <option value="">Select your blood group</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="O-">O-</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="leftEye" className="block text-lg text-blue-950 mb-2">UPLOAD IMAGE OF LEFT EYE</label>
              <input
                type="file"
                id="leftEye"
                name="leftEye"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'left')}
                className="w-full p-4 border border-blue-600 rounded-xl"
              />
            </div>

            <div>
              <label htmlFor="rightEye" className="block text-lg text-blue-950 mb-2">UPLOAD IMAGE OF RIGHT EYE</label>
              <input
                type="file"
                id="rightEye"
                name="rightEye"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'right')}
                className="w-full p-4 border border-blue-600 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-lg text-blue-950 mb-2">SHORT MESSAGE</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-4 border border-blue-600 rounded-xl"
              placeholder="Share any additional information"
              rows="4"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-950 px-6 w-full py-4 rounded-4xl text-white text-lg mt-8 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900'}`}
          >
            {loading ? 'Processing...' : 'SUBMIT'}
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
});

export default EyeFormSection;
