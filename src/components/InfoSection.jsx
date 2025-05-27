import React from 'react'
import Card from './Card'

const InfoSection = () => {
    const data1= [ 
        {
            id: 1,
            frontImage: 'https://cdn-icons-png.flaticon.com/512/998/998463.png ',
            title : 'PROFESSIONALS'
        },
        {
            id: 2,
            frontImage: 'https://cdn-icons-png.flaticon.com/512/547/547562.png',
            title : 'FAMILIES'
        },
        {
            id: 3,
            frontImage: 'https://cdn-icons-png.flaticon.com/512/18776/18776482.png  ',
            title : 'REMOTE AREAS'
        },
        {
            id: 4,
            frontImage: 'https://cdn-icons-png.flaticon.com/512/2966/2966334.png ',
            title : 'HEALTHCARE'
        }
    ]
    return (
        <>
            <div className='bg-gradient-to-t from-blue-100 to-white flex justify-center p-6'>
                <div className='flex flex-row bg-blue-200/70 mt-28 rounded-4xl w-[90%] border border-white'>
                    <div className=''>
                        <img src='https://mediicc.netlify.app/images/about-3.jpg' className='rounded-4xl'/>
                    </div>
                    <div className='mt-10 ml-20'>
                        <div className='rounded-4xl px-4 py-2 border border-white bg-white/30 text-blue-600 text-lg w-fit'>Who can use Vision AI</div>
                        <div className='text-5xl font-bold text-blue-950 mt-5 leading-tight'>Start Your Journey to  <br />
                        Clearer Vision with <br/>VisionAI</div>
                        <div className='text-gray-500 mt-5'>
                        At VisionAI, we believe that everyone deserves access to advanced eye care. <br />Our AI-powered eye checkup is designed for all, making vision screening fast, <br/>accurate, and effortless.
                        </div>
                        <div className='grid grid-cols-2 mb-10'>
    {data1.map((options, index) => (
        <div key={index} className='flex flex-row mt-10 items-center w-fit'>
            <div className='bg-blue-950 p-4 rounded-2xl inline-block'>
                <img src={options.frontImage} className='w-10 h-10 invert'/>
            </div>
            <div>
                <div className='text-blue-600 font-medium text-lg ms-4'>
                    {options.title}
                </div>
                {/* <div>
                    Professional intellectual capital without enterprise users <br />
                    Seamlessly matrix value e-commerce
                </div> */}
            </div>
        </div>
    ))}
</div>

                    </div>
                </div>
            </div>
          
        </>
    )
}

export default InfoSection