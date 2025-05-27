import React, { useEffect, useState } from 'react'
import { BiCalendar } from 'react-icons/bi'
import { BsGraphUp } from 'react-icons/bs'
import { GoReport } from 'react-icons/go'
import { GrFormCheckmark, GrGraphQl } from 'react-icons/gr'
import { MdReport } from 'react-icons/md'
import { TbReportAnalytics } from 'react-icons/tb'
import { useAuth } from '../helper/AuthContext'

const DashContent = ({dashboardData, appointments}) => {
  const [data, setData] = useState()
  const [appointments1, setAppointments] = useState()
  useEffect(() => {
    setData(dashboardData)
    setAppointments(appointments)
  }, [dashboardData])
  console.log(data, "dashboardData in dashcontent")
  // const {user} = useAuth()
  // useEffect(() => {

  // }, [user]);
  const sortedAppointments = appointments1?.sort((a, b) => {
    return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
  });
  console.log(appointments1, "appointments")
  const recentAppointment = sortedAppointments?.[0]
  const sortedPredictions = dashboardData?.feedbacks?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  const recentPrediction = sortedPredictions?.[0]
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    
    // Determine the suffix for the day
    const suffix = (day) => {
      if (day >= 11 && day <= 13) return 'th'; // Special case for 11th, 12th, 13th
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${suffix(day)} ${month}`;
  };
  

    // const CardsData = [
    //     {
    //         id: 1,
    //         title: 'Recent Results',
    //         number: 
    //     },
    //     {
    //         id: 2,
    //         title: 'Tests Completed',
    //         number: 12
    //     }
    // ]
  return (
    <div>
        <div className='text-black text-4xl font-bold ml-20 mt-6'>Welcome User</div>
        <div className='grid grid-cols-3 mt-6 ml-20'>
        <div className='border border-gray-200 w-fit py-8 px-12 rounded-2xl'>
            <div className='flex items-center gap-8'>
                <div >
        <div className='text-gray-500 text-lg'>Recent Test Results</div>
        <div className='text-gray-500 text-lg mt-4'><span className='text-green-600 text-2xl font-bold'>{(recentPrediction?.prediction?.leftEye?.result === 'normal' && recentPrediction?.prediction?.rightEye?.result === 'normal') ? "Normal" : (recentPrediction?.prediction?.leftEye?.result === 'cataract' || recentPrediction?.prediction?.rightEye?.result === 'cataract') ? "Cataract" :(recentPrediction?.prediction?.leftEye?.result === 'glaucoma' || recentPrediction?.prediction?.rightEye?.result === 'glaucoma') ? "Glaucoma" :(recentPrediction?.prediction?.leftEye?.result === 'diabetic_retinopathy' || recentPrediction?.prediction?.rightEye?.result === 'diabetic_retinopathy') ? "Diabetic Retinopathy" : "Normal"}</span></div>
        </div>
        <div>
        <BsGraphUp size={30}/>
        </div>
        </div>
      </div>
        <div className='border border-gray-200 w-fit py-8 px-12 rounded-2xl'>
            <div className='flex items-center gap-8'>
                <div >
        <div className='text-gray-500 text-lg'>Tests Completed</div>
        <div className='text-gray-500 text-lg mt-4'><span className='text-black text-2xl font-bold'>{data?.feedbacks?.length}</span></div>
        </div>
        <div>
        <TbReportAnalytics size={30}/>
        </div>
        </div>
      </div>
      <div className='border border-gray-200 w-fit py-8 px-12 rounded-2xl'>
            <div className='flex items-center gap-8'>
                <div >
        <div className='text-gray-500 text-lg'>Upcoming <br/> Appointments</div>
        <div className='text-gray-500 text-lg mt-4'><span className='text-black text-2xl font-bold'> {recentAppointment?.appointmentDate ? formatDate(recentAppointment?.appointmentDate) : 'No appointment date'}</span></div>
        </div>
        <div>
        <BiCalendar size={30}/>
        </div>
        </div>
      </div>
        </div>
     
    </div>
  )
}

export default DashContent
