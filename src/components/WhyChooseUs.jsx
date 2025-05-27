import React from 'react'
import Card from './Card'

const WhyChooseUs = () => {
    const CardData = [
        {
            id: 1,
            frontImage: 'https://adaptalux.com/wp-content/uploads/2023/11/iris-photography-no-reflections-method.jpg',
            title: 'UPLOAD YOUR EYE IMAGES',
            subtitle: 'Simply upload high-quality images of your left and right eyes using our easy-to-use platform.'
        },
        {
            id: 2,
            frontImage: 'https://hgs.cx/wp-content/uploads/2023/09/Generative-AI_Information-retrieval-banner.webp',
            title: 'AI ANALYSIS',
            subtitle: 'Our advanced AI algorithms analyze your eye images and detect any irregularities or health concerns.'
        },
        {
            id: 3,
            frontImage: 'https://www.searchenginejournal.com/wp-content/uploads/2020/09/2f82abaf-f090-4c27-9eae-82421a23f62c-5f7265d2aafe4.jpeg',
            title: 'RECEIVE RESULTS',
            subtitle: 'Get a detailed report of your eye health, including suggestions for follow-up actions or potential treatments.'
        },
        {
            id: 4,
            frontImage: 'https://res.cloudinary.com/dycihkdzs/image/upload/c_fill,f_auto/cloud/download/konsultasi-dokter-101-berdiskusi-dengan-dokter-offline-dan-online-2-23052023-082805.jpg',
            title: 'CONSULT WITH EXPERTS',
            subtitle: 'If needed, you can easily schedule a consultation with one of our trusted eye care professionals.'
        }
    ]
    const data1 = [
        {
            id : 1,
            imglink: 'https://mediicc.netlify.app/images/why-icn.png',
            title : 'Instant Eye Analysis'
        },
        {
            id: 2,
            imglink : 'https://mediicc.netlify.app/images/why-icn2.png',
            title: 'AI-Powered Accuracy'
        }, 
        {
            id: 3,
            imglink : 'https://mediicc.netlify.app/images/why-icn3.png',
            title : 'Early Detection'
        }, 
        {
            id : 4,
            imglink : '	https://mediicc.netlify.app/images/why-icn4.png',
            title : 'User-Friendly & Contactless'
        }
    ]
  return (
    <>
    <div className='bg-blue-200/30'>
    <div className='flex flex-row justify-center gap-20'>
    <div className='mt-20'>
        <img src="https://img.freepik.com/free-photo/doctor-patient-ophthalmologist-s-office_23-2150923336.jpg" className='rounded-3xl'/>
    </div>
    <div className='mt-20'>
    <div className='mt-10 text-blue-600 font-medium text-2xl'>
        Why Choose us ?
    </div>
    <div className='text-blue-950 text-6xl font-bold mt-10'>
    Expert Eye Analysis,  <br/>
    Anytime
    </div>
    <div className='mt-10 text-gray-600'>
    Our AI-driven system, built with advanced medical expertise, <br/>delivers precise eye health assessments in minutes—no need <br/>for long hospital visits.
    </div>
    <div className='grid grid-cols-2 mt-10'>
        {
            data1.map((options,index) => (
                <div key={index} className='flex rounded-2xl border border-white bg-white/30 p-6 w-3/4 items-center gap-8 mb-10'>
            <img src={options.imglink} />
            <div>{options.title}</div>
        </div>
            ))
        }
        
    </div>
    </div>
    </div>
    </div>
    <div className='bg-blue-950 py-10'>
                <div className='flex justify-between items-center ms-20'>
                    <div className='text-white font-medium text-5xl'>
                        HOW <br />IT <br />WORKS?
                    </div>
                    <div className='text-gray-300'>
                        Our AI-driven platform takes the <br />guesswork out of eye care. <br />Here’s how it works:
                    </div>
                    <div className='bg-white  w-fit rounded-4xl px-6 py-4 text-blue-950 text-lg mt-10 items-center me-20'>
                        CHECK OUR AI
                    </div>
                </div>
                <div className='flex justify-between mt-10'>
                    {
                        CardData.map((option) => (
                            <Card
                                key={option.id}
                                frontImage={option.frontImage}
                                backTitle={option.title}
                                backSubText={option.subtitle}
                            />
                        ))
                    }

                </div>
            </div>
    </>
  )
}

export default WhyChooseUs