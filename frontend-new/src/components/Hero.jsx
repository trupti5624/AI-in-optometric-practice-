import React, { useRef } from 'react'

const Hero = () => {
    const eyeformRef = useRef(null); // Create a ref for the Eyeform section

    const handleScroll = () => {
        if (eyeformRef.current) {
            eyeformRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
  return (
    <div className='bg-blue-200/70 flex flex-row justify-evenly h-screen'>
        <div className='mt-20 ms-6'>
            <div className='rounded-4xl px-4 py-2 border border-white bg-white/30 text-blue-600 text-lg w-fit'>Welcome to  VisionAI</div>
            <div className='font-bold text-7xl mt-20 text-blue-950'>BETTER CARE FOR <br/>YOUR <span className='text-blue-600'>EYES</span></div>
            <div className='bg-white/30 rounded-lg w-fit p-6 mt-12 border border-white flex flex-row gap-4 items-center'>
            <div>
                <img src = 'https://mediicc.netlify.app/images/tick.png' />
            </div>
            <div>
                <div className='text-blue-950 font-medium text-lg'>
                Best Medical
                </div>
                <div className='text-gray-600'>
                Rapidiously reinvent long-term
                </div>
                </div>
            </div>
            <div className='bg-blue-950 px-6 w-fit py-4 rounded-4xl text-white text-lg mt-10 cursor-pointer' onClick={handleScroll}>
                CHECK OUR AI
            </div>
        </div>
        <div className='w-[49%] '>
        <img src='https://www.pngmart.com/files/21/Female-Doctor-PNG-HD-Isolated.png' />
        </div>
    </div>
  )
}

export default Hero