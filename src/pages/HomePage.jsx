import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import Hero from '../components/Hero'
import InfoSection from '../components/InfoSection'
import EyeFormSection from '../components/EyeFormSection'
import WhyChooseUs from '../components/WhyChooseUs'
import LoginModal from '../components/LoginModal'
import SignupModal from '../components/SignupModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);

  const handleFormAccess = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  return (
    <>
      {/* Dim background when modal is open */}
      <div className={`${showLoginModal || isSignupOpen ? 'filter blur-sm' : ''}`}>
        <div className={(showLoginModal || isSignupOpen) ? 'pointer-events-none' : ''}>
          
          {/* Pass both login and signup modal triggers to NavBar */}
          <NavBar 
            isLoggedIn={isLoggedIn} 
            onLoginClick={() => setShowLoginModal(true)} 
            onSignupClick={() => setSignupOpen(true)} 
          />
          
          <Hero />
          <WhyChooseUs />
          <EyeFormSection onFormAccess={handleFormAccess} />
          <InfoSection />
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => setIsLoggedIn(true)}
      />

      {/* Signup Modal */}
      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setSignupOpen(false)}
      />
      
      <ToastContainer />
    </>
  )
}

export default HomePage
