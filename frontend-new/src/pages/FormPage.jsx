import React from 'react'
import SideNav from '../components/SideNav'
import EyeFormSection from '../components/EyeFormDashboard'

const FormPage = () => {
  return (
    <div className='flex'>
    <SideNav />
    <div className='ml-64 w-full'>
    <EyeFormSection/>
    
    </div>
  </div>
  )
}

export default FormPage
