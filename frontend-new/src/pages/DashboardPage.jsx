import React, { useEffect, useState } from 'react'
import SideNav from '../components/SideNav'
import DashContent from '../components/DashContent'
import RecentTests from '../components/Recenttests'
import EyeHealthTips from '../components/EyeHealthTips'
import Cookies from 'js-cookie'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AppointmentList from '../components/AppointmentList'

const DashboardPage = () => {
  const user = Cookies.get('user')
  const navigate = useNavigate()
  const [ dashData, setDashData] = useState()
  const [appointments, setAppointments] = useState()

  const fetchAppointments = async () => {
    try {
      // console.log("hi")
      const response = await axios.get(`http://localhost:3000/data/appointments/${user}`)
      // const fetchedAppointments = await AppointmentService.getAppointments(userId);
      // console.log(response, "response")
      setAppointments(response?.data?.appointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      // setLoading(false);
    }
  };
console.log(appointments, "appointments in dashboardpage")
  
  useEffect(() => {
    if (user) {
      dashboardContent()
      fetchAppointments();
    } else {
      navigate('/')
    }
  },[])
  const dashboardContent = async() => {
    const data = {
      userId: user
    }
    try {
      const response = await axios.post('http://localhost:3000/data/feedback-fetch', data)
      // console.log(dashboarddata, "dashboarddata")
      setDashData(response?.data)
    } catch(error) {
      console.log(error)
    }
  }
  const sortedPredictions = dashData?.feedbacks?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  const recentPrediction = sortedPredictions?.[0]
  return (
    <div className="flex">
    <SideNav />
    <div className="ml-64 w-full">
      {/* Dashboard Content */}
      <DashContent dashboardData={dashData} appointments={appointments} />

      {/* Main Section with Recent Tests and Appointments */}
      <div className="flex mt-8 space-x-8">
        {/* Recent Eye Tests Section */}
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-semibold mb-4 ml-28">Recent Eye Tests</h2>
          <RecentTests dashboardData={dashData} />
        </div>

        {/* Appointment List Section */}
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-semibold mb-4">Upcoming Appointments</h2>
          <AppointmentList appointments={appointments} />
        </div>
      </div>

      {/* Eye Health Tips Section */}
      <div className="mt-8">
        <EyeHealthTips condition={(recentPrediction?.prediction?.leftEye?.result === 'normal' && recentPrediction?.prediction?.rightEye?.result === 'normal') ? "Normal" : (recentPrediction?.prediction?.leftEye?.result === 'cataract' || recentPrediction?.prediction?.rightEye?.result === 'cataract') ? "Cataract" :(recentPrediction?.prediction?.leftEye?.result === 'glaucoma' || recentPrediction?.prediction?.rightEye?.result === 'glaucoma') ? "Glaucoma" :(recentPrediction?.prediction?.leftEye?.result === 'diabetic_retinopathy' || recentPrediction?.prediction?.rightEye?.result === 'diabetic_retinopathy') ? "Diabetic Retinopathy" : "Normal"}/>
      </div>
    </div>
  </div>

  )
}

export default DashboardPage;