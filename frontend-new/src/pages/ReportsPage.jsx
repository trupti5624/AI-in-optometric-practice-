import React, { useEffect, useState } from 'react'
import RecentTests from '../components/Recenttests'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import SideNav from '../components/SideNav'

const ReportsPage = () => {
    const user = Cookies.get('user')
    const [ dashData, setDashData] = useState()
    const navigate = useNavigate()
    useEffect(() => {
      if (user) {
        dashboardContent()
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
  return (
    <div className='flex'>
        <SideNav />
        <div className='ml-[14%] w-full'>
        <h2 className="text-3xl font-semibold mb-2 ml-28 mt-20">Recent Eye Tests</h2>
        <RecentTests dashboardData = {dashData}/>
        </div>
       
    </div>
  )
}

export default ReportsPage
