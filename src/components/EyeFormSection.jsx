import React, { forwardRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../helper/AuthContext';
import axios from 'axios';
// import debounce from 'lodash.debounce';

const EyeFormSection = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const conditions = ["CATARACTS", "GLAUCOMA", "DIABETIC RETINOPATHY", "REFRACTIVE ERRORS"];
  
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
    <>
    <div className='bg-gradient-to-t from-blue-100 to-white py-20' ref={ref} id="eyeform">
        <div className='text-center text-blue-950 font-bold text-5xl mt-10'>START YOUR EYE HEALTH ASSESSMENT</div>
        <div className='w-[90%] flex flex-row ms-20 mt-20 border border-white gap-10 bg-white/50 px-4 rounded-2xl'>
            <div className='rounded-md w-[60%]'>
            <img src= 'https://asianheartinstitute.org/wp-content/uploads/2023/12/home-banner-mob.webp' className='rounded-2xl'/>
            </div>
            <div>
  <div className='text-blue-950 font-medium text-xl mt-12'>
    Take a quick and easy test to assess your vision health. <br />Get personalized insights and recommendations to <br />improve your eye care.
  </div>

  <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
  <div className='flex flex-row gap-30'>
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
    <div className='flex flex-row gap-30'>
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
      <div className="relative">
  <input 
    type="text" 
    id="location" 
    name="location"
    value={formData.location}
    onChange={handleInputLocationChange}
    onKeyDown={handleKeyDown}
    className="w-full p-4 border border-blue-600 rounded-xl" 
    placeholder="Enter your location" 
  />
  
  {suggestions.length > 0 && (
    <ul className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-xl overflow-auto border border-blue-200">
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
    </div>
    </div>

    {/* <div>
      
    </div> */}

    <div className='flex flex-row gap-30'>
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

    {/* <div>
      
    </div> */}
        <div className='flex flex-row gap-30'>
    <div>
      <label htmlFor="leftEye" className="block text-lg text-blue-950 mb-2">UPLOAD IMAGE OF LEFT EYE</label>
      <input 
        type="file" 
        id="leftEye" 
        name="leftEye" 
        accept="image/*" 
        onChange={(e) => handleImageChange(e, 'left')}
        className="w-3/4 p-4 border border-blue-600 rounded-xl"
      />
    </div>

    <div className='ml-[-12%]'>
      <label htmlFor="rightEye" className="block text-lg text-blue-950 mb-2">UPLOAD IMAGE OF RIGHT EYE</label>
      <input 
        type="file" 
        id="rightEye" 
        name="rightEye" 
        accept="image/*" 
        onChange={(e) => handleImageChange(e, 'right')}
        className="w-3/4 p-4 border border-blue-600 rounded-xl"
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
      className={`bg-blue-950 px-6 w-fit py-4 rounded-4xl text-white text-lg mt-10 mb-10 
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900'}`}
    >
      {loading ? 'Processing...' : 'SUBMIT'}
    </button>
  </form>

  {/* {prediction && (
    <div className="mt-4 p-4 bg-green-100 rounded-xl">
      <h3 className="text-lg font-semibold">Left Eye Analysis Result:</h3>
      <p>{prediction}</p>
    </div>
  )}

  {prediction1 && (
    <div className="mt-4 p-4 bg-green-100 rounded-xl">
      <h3 className="text-lg font-semibold">Right Eye Analysis Result:</h3>
      <p>{prediction1}</p>
    </div>
  )} */}
</div>

        </div>
    </div>
    <div className="bg-blue-950 overflow-hidden py-8">
      <motion.div
        className="flex gap-10 text-white font-medium text-4xl items-center whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...conditions, ...conditions].map(
          (condition, index) => (
            <div key={index} className="flex items-center gap-6">
              <span>{condition}</span>
              <motion.img
                src="https://mediicc.netlify.app/images/star.png"
                alt="Star"
                className="w-8 h-8"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              />
            </div>
          )
        )}
      </motion.div>
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
   
    </>
  )
})

export default EyeFormSection

// import React, { forwardRef, useState } from 'react'
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';

// const EyeFormSection = forwardRef((props, ref) => {
//   const navigate = useNavigate();
//   const conditions = ["CATARACTS", "GLAUCOMA", "DIABETIC RETINOPATHY", "REFRACTIVE ERRORS"];
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     age: '',
//     bloodGroup: '',
//     message: ''
//   });

//   const [leftEyeImage, setLeftEyeImage] = useState(null);
//   const [rightEyeImage, setRightEyeImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [prediction, setPrediction] = useState('');
//   const [prediction1, setPrediction1] = useState('');
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [aiResponse, setAiResponse] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleImageChange = (e, eye) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (eye === 'left') {
//         setLeftEyeImage(file);
//       } else {
//         setRightEyeImage(file);
//       }
//     }
//   };

//   const validateForm = () => {
//     const errors = [];
    
//     if (!formData.name.trim()) errors.push('Name is required');
//     if (!formData.email.trim()) errors.push('Email is required');
//     if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.push('Invalid email format');
//     if (!formData.phone.trim()) errors.push('Phone number is required');
//     if (!/^\d{10}$/.test(formData.phone)) errors.push('Invalid phone number format');
//     if (!formData.location.trim()) errors.push('Location is required');
//     if (!formData.age || formData.age < 1) errors.push('Valid age is required');
//     if (!formData.bloodGroup) errors.push('Blood group is required');
//     if (!leftEyeImage) errors.push('Left eye image is required');
//     if (!rightEyeImage) errors.push('Right eye image is required');

//     return errors;
//   };

//   const handleImageSubmit = async (eye) => {
//     const imageFile = eye === 'left' ? leftEyeImage : rightEyeImage;
    
//     if (imageFile) {
//       const formData = new FormData();
//       formData.append('file', imageFile);
//       setLoading(true);
//       setError('');

//       try {
//         const response = await fetch('http://127.0.0.1:5000/predict', {
//           method: 'POST',
//           body: formData,
//         });
  
//         const data = await response.json();
        
//         if (data.error) {
//           setError(data.error);
//           toast.error(data.error);
//         } else {
//           if (eye === 'left') {
//             setPrediction(data.prediction);
//             sessionStorage.setItem('leftEyePrediction', data.prediction);
//           } else {
//             setPrediction1(data.prediction);
//             sessionStorage.setItem('rightEyePrediction', data.prediction);
//           }
//           toast.success(`${eye.charAt(0).toUpperCase() + eye.slice(1)} eye analysis completed`);
//         }
//       } catch (err) {
//         const errorMsg = 'Error occurred while uploading the file.';
//         setError(errorMsg);
//         toast.error(errorMsg);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       const errorMsg = `No ${eye} eye image selected`;
//       setError(errorMsg);
//       toast.error(errorMsg);
//     }
//   };

//   // const generateFeedback = async () => {
//   //   try {
//   //     const response = await fetch("http://127.0.0.1:5000/generate-feedback", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         name: formData.name,
//   //         age: formData.age,
//   //         symptoms: `Eye examination results - Left Eye: ${prediction || 'No prediction'}, Right Eye: ${prediction1 || 'No prediction'}`,
//   //         medicalHistory: formData.message || ''
//   //       }),
//   //     });

//   //     const data = await response.json();
//   //     if (data.error) {
//   //       toast.error(data.error);
//   //     } else {
//   //       const paragraphs = data.feedback.split('\n').filter(para => para.trim() !== '');
//   //       setAiResponse(paragraphs);
//   //       setShowFeedback(true);
//   //       toast.success("Feedback generated successfully!");
//   //     }
//   //   } catch (err) {
//   //     toast.error("Error generating feedback");
//   //   }
//   // };
//   // console.log(prediction, prediction1)
//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!props.onFormAccess()) {
//     return;
//   }

//   const validationErrors = validateForm();

//   if (validationErrors.length > 0) {
//     validationErrors.forEach(error => toast.error(error));
//     return;
//   }

//   setLoading(true);

//   try {
//     // Process both eyes
//     await handleImageSubmit('left');
//     await handleImageSubmit('right');

//     if (!error) {
//       toast.success('Analysis completed successfully!');

//       // Store form data in sessionStorage
//       sessionStorage.setItem('eyeFormData', JSON.stringify({
//         name: formData.name,
//         age: formData.age,
//         email: formData.email,
//         phone: formData.phone,
//         bloodGroup: formData.bloodGroup,
//         medicalHistory: formData.message || ''
//       }));

//       // Wait for predictions to be set before navigating
//       setTimeout(async () => {
//         try {
//           const leftPrediction = sessionStorage.getItem('leftEyePrediction');
//           const rightPrediction = sessionStorage.getItem('rightEyePrediction');
//           const leftEyeBase64 = await getBase64(leftEyeImage);
//           const rightEyeBase64 = await getBase64(rightEyeImage);

//           console.log('Predictions before navigation:', {
//             left: leftPrediction,
//             right: rightPrediction
//           });

//           // Navigate to feedback page with predictions data
//           navigate('/feedback', {
//             state: {
//               predictions: {
//                 leftEye: {
//                   result: leftPrediction,
//                   image: leftEyeBase64
//                 },
//                 rightEye: {
//                   result: rightPrediction,
//                   image: rightEyeBase64
//                 }
//               }
//             }
//           });
//         } catch (conversionError) {
//           console.error('Image conversion error:', conversionError);
//           toast.error('Error processing images');
//         }
//       }, 2000); // Wait for 2 seconds to ensure state updates
//     }
//   } catch (err) {
//     toast.error('An error occurred while processing your submission');
//     console.error('Submission error:', err);
//   } finally {
//     setLoading(false);
//   }
// };


//   // Helper function to convert image to base64
//   const getBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       if (!file) {
//         resolve(null);
//         return;
//       }
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   return (
//     <>
//     <div className='bg-gradient-to-t from-blue-100 to-white py-20' ref={ref} id="eyeform">
//         <div className='text-center text-blue-950 font-bold text-5xl mt-10'>START YOUR EYE HEALTH ASSESSMENT</div>
//         <div className='w-[90%] flex flex-row ms-20 mt-20 border border-white gap-10 bg-white/50 px-4 rounded-2xl'>
//             <div className='rounded-md w-[60%]'>
//             <img src= 'https://asianheartinstitute.org/wp-content/uploads/2023/12/home-banner-mob.webp' className='rounded-2xl'/>
//             </div>
//             <div>
//   <div className='text-blue-950 font-medium text-xl mt-12'>
//     Take a quick and easy test to assess your vision health. <br />Get personalized insights and recommendations to <br />improve your eye care.
//   </div>

//   <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
//   <div className='flex flex-row gap-30'>
//     <div>
//       <label htmlFor="name" className="block text-lg text-blue-950 mb-2">NAME</label>
//       <input 
//         type="text" 
//         id="name" 
//         name="name"
//         value={formData.name}
//         onChange={handleInputChange}
//         className="w-full p-4 border border-blue-600 rounded-xl" 
//         placeholder="Enter your Name" 
//       />
//       </div>
//       <div>
//       <label htmlFor="email" className="block text-lg text-blue-950 mb-2">EMAIL</label>
//       <input 
//         type="email" 
//         id="email" 
//         name="email"
//         value={formData.email}
//         onChange={handleInputChange}
//         className="w-full p-4 border border-blue-600 rounded-xl" 
//         placeholder="Enter your email" 
//       />
//       </div>
//     </div>
//     <div className='flex flex-row gap-30'>
//     <div>
//       <label htmlFor="phone" className="block text-lg text-blue-950 mb-2">PHONE NUMBER</label>
//       <input 
//         type="tel" 
//         id="phone" 
//         name="phone"
//         value={formData.phone}
//         onChange={handleInputChange}
//         className="w-full p-4 border border-blue-600 rounded-xl" 
//         placeholder="Enter your phone number" 
//       />
//     </div>
//     <div>
//       <label htmlFor="location" className="block text-lg text-blue-950 mb-2">LOCATION</label>
//       <input 
//         type="text" 
//         id="location" 
//         name="location"
//         value={formData.location}
//         onChange={handleInputChange}
//         className="w-full p-4 border border-blue-600 rounded-xl" 
//         placeholder="Enter your location" 
//       />
//     </div>
//     </div>

//     {/* <div>
      
//     </div> */}

//     <div className='flex flex-row gap-30'>
//         <div>
//       <label htmlFor="age" className="block text-lg text-blue-950 mb-2">AGE</label>
//       <input 
//         type="number" 
//         id="age" 
//         name="age"
//         value={formData.age}
//         onChange={handleInputChange}
//         className="w-full p-4 border border-blue-600 rounded-xl" 
//         placeholder="Enter your age" 
//       />
//       </div>
//       <div>
//       <label htmlFor="bloodGroup" className="block text-lg text-blue-950 mb-2">BLOOD GROUP</label>
//       <select 
//         id="bloodGroup" 
//         name="bloodGroup"
//         value={formData.bloodGroup}
//         onChange={handleInputChange}
//         className="w-full p-4 border border-blue-600 rounded-xl"
//       >
//         <option value="">Select your blood group</option>
//         <option value="A+">A+</option>
//         <option value="B+">B+</option>
//         <option value="O+">O+</option>
//         <option value="AB+">AB+</option>
//         <option value="A-">A-</option>
//         <option value="B-">B-</option>
//         <option value="O-">O-</option>
//         <option value="AB-">AB-</option>
//       </select>
//       </div>
//     </div>

//     {/* <div>
      
//     </div> */}
//         <div className='flex flex-row gap-30'>
//     <div>
//       <label htmlFor="leftEye" className="block text-lg text-blue-950 mb-2">UPLOAD IMAGE OF LEFT EYE</label>
//       <input 
//         type="file" 
//         id="leftEye" 
//         name="leftEye" 
//         accept="image/*" 
//         onChange={(e) => handleImageChange(e, 'left')}
//         className="w-3/4 p-4 border border-blue-600 rounded-xl"
//       />
//     </div>

//     <div className='ml-[-12%]'>
//       <label htmlFor="rightEye" className="block text-lg text-blue-950 mb-2">UPLOAD IMAGE OF RIGHT EYE</label>
//       <input 
//         type="file" 
//         id="rightEye" 
//         name="rightEye" 
//         accept="image/*" 
//         onChange={(e) => handleImageChange(e, 'right')}
//         className="w-3/4 p-4 border border-blue-600 rounded-xl"
//       />
//     </div>
//     </div>

//     <div>
//       <label htmlFor="message" className="block text-lg text-blue-950 mb-2">SHORT MESSAGE</label>
//       <textarea 
//         id="message" 
//         name="message"
//         value={formData.message}
//         onChange={handleInputChange}
//         className="w-full p-4 border border-blue-600 rounded-xl" 
//         placeholder="Share any additional information" 
//         rows="4"
//       />
//     </div>

//     <button 
//       type="submit" 
//       disabled={loading}
//       className={`bg-blue-950 px-6 w-fit py-4 rounded-4xl text-white text-lg mt-10 mb-10 
//         ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-900'}`}
//     >
//       {loading ? 'Processing...' : 'SUBMIT'}
//     </button>
//   </form>

//   {prediction && (
//     <div className="mt-4 p-4 bg-green-100 rounded-xl">
//       <h3 className="text-lg font-semibold">Left Eye Analysis Result:</h3>
//       <p>{prediction}</p>
//     </div>
//   )}

//   {prediction1 && (
//     <div className="mt-4 p-4 bg-green-100 rounded-xl">
//       <h3 className="text-lg font-semibold">Right Eye Analysis Result:</h3>
//       <p>{prediction1}</p>
//     </div>
//   )}
// </div>

//         </div>
//     </div>
//     <div className="bg-blue-950 overflow-hidden py-8">
//       <motion.div
//         className="flex gap-10 text-white font-medium text-4xl items-center whitespace-nowrap"
//         animate={{ x: ["0%", "-100%"] }}
//         transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
//       >
//         {[...conditions, ...conditions].map(
//           (condition, index) => (
//             <div key={index} className="flex items-center gap-6">
//               <span>{condition}</span>
//               <motion.img
//                 src="https://mediicc.netlify.app/images/star.png"
//                 alt="Star"
//                 className="w-8 h-8"
//                 animate={{ rotate: 360 }}
//                 transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
//               />
//             </div>
//           )
//         )}
//       </motion.div>
//     </div>
//     <ToastContainer
//       position="top-right"
//       autoClose={5000}
//       hideProgressBar={false}
//       newestOnTop
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover
//       theme="colored"
//     />
//     <AnimatePresence>
//       {showFeedback ? (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           className="max-w-4xl mx-auto mt-10 p-8"
//         >
//           <div className="bg-white rounded-4xl shadow-2xl overflow-hidden">
//             <div className="bg-blue-950 p-6 text-white">
//               <h2 className="text-2xl font-bold">Your AI-Generated Health Feedback</h2>
//               <p className="text-blue-200 mt-2">Based on your eye examination results</p>
//             </div>
            
//             <div className="p-8">
//               <div className="grid grid-cols-2 gap-6 mb-8">
//                 <div className="bg-blue-50 rounded-xl p-4">
//                   <h3 className="text-blue-950 font-semibold mb-2">Left Eye Analysis</h3>
//                   <p className="text-gray-700">{prediction || 'No prediction available'}</p>
//                 </div>
//                 <div className="bg-blue-50 rounded-xl p-4">
//                   <h3 className="text-blue-950 font-semibold mb-2">Right Eye Analysis</h3>
//                   <p className="text-gray-700">{prediction1 || 'No prediction available'}</p>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 {aiResponse && aiResponse.map((paragraph, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.2 }}
//                     className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl"
//                   >
//                     <p className="text-gray-700 leading-relaxed">{paragraph}</p>
//                   </motion.div>
//                 ))}
//               </div>

//               <div className="mt-8 flex gap-4 justify-center">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => window.print()}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center gap-2"
//                 >
//                   <span>Print Report</span>
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setShowFeedback(false)}
//                   className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full flex items-center gap-2"
//                 >
//                   <span>Back to Form</span>
//                 </motion.button>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           className='w-[90%] flex flex-row ms-20 mt-20 border border-white gap-10 bg-white/50 px-4 rounded-2xl'
//         >
//           {/* Your existing form JSX */}
//           {/* ... */}
//         </motion.div>
//       )}
//     </AnimatePresence>
//     </>
//   )
// })

// export default EyeFormSection